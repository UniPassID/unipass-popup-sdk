import {
  arrayify,
  computeAddress,
  concat,
  hashMessage,
  hexlify,
  keccak256,
  solidityPack,
  toUtf8String,
  zeroPad,
} from 'ethers/lib/utils'
import { decryptKeystore, encryptKeystore } from '@unipasswallet/utils'
import { SignType } from '@unipasswallet/keys'
import api, {
  FinishKeygenInput,
  KeyGenInput,
  SignInput,
  StartKeyGenInput,
} from '../service/backend'
import TssWorker from './tss-worker'
import { subDigest } from '@unipasswallet/utils'

export const SIG_PREFIX = {
  LOGIN: 'login UniPass:',
  UPDATE_GUARDIAN: 'update guardian:',
  UPLOAD: 'up master key server upload request:',
  BIND_2FA: 'bind 2FA:',
  UNBIND_2FA: 'unbind 2FA:',
  UPDATE_2FA: 'update 2FA:',
  QUERY_SYNC_STATUS: 'query sync status:',
  GET_SYNC_TRANSACTION: 'get sync transaction:',
}

export interface StartKeygenData {
  keygenInput: KeyGenInput
  context2: string
}

export interface GetKeygenData {
  signContext2: any
  finishKeygenInput: FinishKeygenInput
}

export interface LocalKeyData {
  localKeyAddress: string
  userId: string
  keystore: string
  upAuthToken: string
}

export interface decryptLocalKeyData {
  localKey: any
  localKeyAddress: string
}

// Permit
enum SignerType {
  EIP712 = 1,
  EthSig = 2,
}

const startKeygen = async (data: StartKeyGenInput): Promise<StartKeygenData> => {
  const startKeygen = await api.startKeygen(data)

  const res = startKeygen.data.tssRes

  const [context2, p2FirstMsg] = await TssWorker.getP2KeyGen1(res)
  const keygenInput: KeyGenInput = {
    sessionId: res.sessionId,
    tssMsg: p2FirstMsg,
    upAuthToken: startKeygen.data.upAuthToken,
    email: data.email,
    action: data.action,
  }
  return {
    context2,
    keygenInput,
  }
}

const getKeygen = async (startKeygenData: StartKeygenData): Promise<GetKeygenData> => {
  const keygen = await api.getKeygen(startKeygenData.keygenInput)
  const res = keygen.data.tssRes

  const [signContext2, pubkey] = await TssWorker.getP2KeyGen2(res, startKeygenData.context2)
  const localKeyAddress = computeAddress(pubkey.point)
  const finishKeygenInput = {
    sessionId: res.sessionId,
    upAuthToken: keygen.data.upAuthToken,
    email: startKeygenData.keygenInput.email,
    userId: res.userId,
    localKeyAddress,
    action: startKeygenData.keygenInput.action,
  }

  return { signContext2, finishKeygenInput }
}

const finishKeygen = async (
  getKeygenData: GetKeygenData,
  password: string,
): Promise<LocalKeyData> => {
  const { signContext2, finishKeygenInput } = getKeygenData
  const keystore = await encryptKeystore(Buffer.from(JSON.stringify(signContext2)), password, {
    scrypt: { N: 16 },
  })

  const finishKeygen = await api.finishKeygen(finishKeygenInput)
  const upAuthToken = finishKeygen.data.upAuthToken
  const { userId, localKeyAddress } = finishKeygenInput
  return { localKeyAddress, userId, keystore, upAuthToken }
}

const generateLocalKey = async (
  data: StartKeyGenInput,
  password: string,
): Promise<LocalKeyData | null> => {
  try {
    let startKeygenData: StartKeygenData
    try {
      startKeygenData = await startKeygen(data)
    } catch (error) {
      return null
    }
    const keygenData = await getKeygen(startKeygenData)
    const localKeyData = await finishKeygen(keygenData, password)
    console.log('[generateLocalKey] localKeyData', localKeyData.localKeyAddress)
    return localKeyData
  } catch (error) {
    return generateLocalKey(data, password)
  }
}
export function digestPermitMessage(
  sessionKeyAddress: string,
  timestamp: number,
  weight: number,
  userAddr: string,
): string {
  return subDigest(
    0,
    userAddr,
    keccak256(
      solidityPack(['address', 'uint32', 'uint32'], [sessionKeyAddress, timestamp, weight]),
    ),
  )
}

const decryptLocalKey = async (keystore: string, password: string) => {
  const decryptData = await decryptKeystore(keystore, password)
  const localKeyStr = toUtf8String(arrayify(decryptData))
  const localKey = JSON.parse(localKeyStr)
  return localKey
}

const startMessageSign = async (
  email: string,
  upAuthToken: string,
  keystore: string,
  localKeyAddress: string,
  password: string,
  rawData: string,
  action: string,
): Promise<SignInput> => {
  const localKey = await decryptLocalKey(keystore, password)
  const messageHash = hashMessage(arrayify(rawData))
  const msgHash = Array.from(arrayify(messageHash))

  const data = await TssWorker.getLi17P2Sign1(localKey, msgHash)
  if (!data) throw Error('error')

  const [context1, message1] = data
  const value = rawData
  const startSign = await api.startSign({
    tssMsg: message1,
    value,
    localKeyAddress,
    upAuthToken,
    email,
    action,
  })
  const res = startSign.data.tssRes
  const sessionId = res.sessionId

  const [partialSig, message2] = await TssWorker.getLi17P2Sign2(context1, res.msg)
  upAuthToken = startSign.data.upAuthToken

  return { upAuthToken, tssMsg: [partialSig, message2], value, sessionId, email, action }
}
const sign = async (signInput: SignInput): Promise<string> => {
  const startSign = await api.sign(signInput)
  const res = startSign.data.tssRes
  let sig = res.msg
  // console.log(`r = ${sig.r} len = ${sig.r.length}`)
  // console.log(`s = ${sig.s} len = ${sig.s.length}`)
  sig.r = zeroPad(sig.r, 32)
  sig.s = zeroPad(sig.s, 32)
  const sigArray = concat([sig.r, sig.s, sig.recid])
  sig = hexlify(sigArray)
  console.log(`[sign] sign = ${sig}`)
  const signStart = sig.slice(0, sig.length - 2)
  if (sig.endsWith('01')) {
    // 01 => 1c
    sig = `${signStart}1c`
  }
  if (sig.endsWith('00')) {
    // 00 => 1b
    sig = `${signStart}1b`
  }
  return sig
}

const generateTxSig = async (
  email: string,
  upAuthToken: string,
  action: string,
  keystore: string,
  localKeyAddress: string,
  password: string,
  rawData: string,
): Promise<string> => {
  try {
    let signInput: SignInput
    //
    try {
      signInput = await startMessageSign(
        email,
        upAuthToken,
        keystore,
        localKeyAddress,
        password,
        rawData,
        action,
      )
    } catch (error) {
      return ''
    }

    const signData = await sign(signInput)
    console.log('[generateTxSig] signData', rawData)
    return signData
  } catch (error) {
    return generateTxSig(email, upAuthToken, action, keystore, localKeyAddress, password, rawData)
  }
}

const generateTssPermit = async (
  email: string,
  upAuthToken: string,
  action: string,
  keystore: string,
  localKeyAddress: string,
  password: string,
  timestamp: number,
  sessionKeyAddress: string,
  weight: number,
  accountAddress: string,
) => {
  const rawData = digestPermitMessage(sessionKeyAddress, timestamp, weight, accountAddress)
  const sig = await generateTxSig(
    email,
    upAuthToken,
    action,
    keystore,
    localKeyAddress,
    password,
    rawData,
  )
  console.log('[generateTssPermit] sig', sig)
  const permit = solidityPack(['bytes', 'uint8'], [sig, SignerType.EthSig])

  console.log('[generateTssPermit] permit', permit)
  return permit
}

// todo rbac tx
const generateTssTxSignature = async (
  email: string,
  upAuthToken: string,
  action: string,
  keystore: string,
  localKeyAddress: string,
  password: string,
  rawData: string,
) => {
  const sig = await generateTxSig(
    email,
    upAuthToken,
    action,
    keystore,
    localKeyAddress,
    password,
    rawData,
  )
  const signature = solidityPack(['bytes', 'uint8'], [sig, SignType.EthSign])

  return signature
}

const Tss = {
  generateLocalKey,
  decryptLocalKey,
  generateTssTxSignature,
  generateTssPermit,
}

export default Tss
