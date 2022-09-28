import { GuardianData } from '@/service/backend'
import { utils, Wallet, providers } from 'ethers'
import { SessionKey, IPermit, Wallet as UnipassWallet } from '@unipasswallet/wallet'
import { Keyset, KeyEmailDkim, KeySecp256k1, SignType, RoleWeight } from '@unipasswallet/keys'
import { digestPermitMessage } from './tss'

import { Weight } from './weight'
import { createHash } from 'crypto'

interface GuardianEmailData {
  email: string
  emailHash: string
  weight: number
}

export interface ISendRecoveryAction {
  canSendStartRecoveryTx: boolean
  isHaveTimeLock: boolean
  isPolicy: boolean
}

export function getAccountKeysetJson(
  guardians: GuardianData[],
  email: string,
  masterKeyAddress: string,
  policyAddress: string,
  pepper: string,
): Keyset {
  const weight = new Weight()
  const masterWeight = weight.getMasterKeyWeight()
  const policyWeight = weight.getPolicyWeight()

  const masterKeyData = new KeySecp256k1(
    masterKeyAddress,
    new RoleWeight(
      masterWeight.ownerWeight,
      masterWeight.assetsOpWeight,
      masterWeight.guardianWeight,
    ),
    SignType.EthSign,
    async () => Promise.resolve(''),
  )
  const policyData = new KeySecp256k1(
    policyAddress,
    new RoleWeight(
      policyWeight.ownerWeight,
      policyWeight.assetsOpWeight,
      policyWeight.guardianWeight,
    ),
    SignType.EthSign,
    async () => Promise.resolve(''),
  )

  const guardiansList: KeyEmailDkim[] = []
  for (const item of guardians) {
    let emailRoleWeight =
      guardians.length < 2 ? weight.getOneGuardianWeight() : weight.getMoreGuardianWeight()

    if (item.isSelfGuardian === true) {
      emailRoleWeight = weight.getSelfGuardianlWeight()
    }
    const keyBase = new KeyEmailDkim(
      item.email.includes('*') ? 'Hash' : 'Raw',
      item.email,
      item.pepper,
      new RoleWeight(
        emailRoleWeight.ownerWeight,
        emailRoleWeight.assetsOpWeight,
        emailRoleWeight.guardianWeight,
      ),
      undefined,
      item.emailHash,
    )
    guardiansList.push(keyBase)
  }

  const getRegisterWeight = weight.getRegisterEmailWeight()
  const keysetData = Keyset.create(
    email,
    pepper,
    masterKeyData,
    guardiansList,
    policyData,
    new RoleWeight(
      getRegisterWeight.ownerWeight,
      getRegisterWeight.assetsOpWeight,
      getRegisterWeight.guardianWeight,
    ),
  )

  return keysetData
}
export function updateKeyset(keysetJson: string, masterKeyAddress: string): Keyset {
  const keyset = Keyset.fromJson(keysetJson)
  const weight = new Weight()
  const masterWeight = weight.getMasterKeyWeight()
  const masterKeyData = new KeySecp256k1(
    masterKeyAddress,
    new RoleWeight(
      masterWeight.ownerWeight,
      masterWeight.assetsOpWeight,
      masterWeight.guardianWeight,
    ),
    SignType.EthSign,
    async () => Promise.resolve(''),
  )
  keyset.keys[0] = masterKeyData
  console.log(keyset.keys)

  return keyset
}

export function getGuardianEmailData(keysetJson: string): GuardianEmailData[] {
  const keyset = Keyset.fromJson(keysetJson)

  const emails: GuardianEmailData[] = []
  for (const item of keyset.keys) {
    const data = item as unknown as KeyEmailDkim
    if (!data.emailFrom) continue
    const guardianEmailData = {
      email: data.emailFrom,
      emailHash: data.emailHash,
      weight: data.roleWeight.guardianWeight,
    }
    emails.push(guardianEmailData)
  }
  return emails
}

function getGuardianWeight(guardianWeight: number, isPolicy: boolean): ISendRecoveryAction {
  const sendRecoveryEmailWeight: ISendRecoveryAction = {
    canSendStartRecoveryTx: false,
    isHaveTimeLock: true,
    isPolicy,
  }

  if (guardianWeight >= 100) {
    sendRecoveryEmailWeight.canSendStartRecoveryTx = true
    sendRecoveryEmailWeight.isHaveTimeLock = false
  } else if (guardianWeight < 100 && guardianWeight >= 50) {
    // guardian email+ guardian email or guardian+ register email
    sendRecoveryEmailWeight.canSendStartRecoveryTx = true
    sendRecoveryEmailWeight.isHaveTimeLock = true
  } else {
    sendRecoveryEmailWeight.canSendStartRecoveryTx = false
    sendRecoveryEmailWeight.isHaveTimeLock = false
  }

  return sendRecoveryEmailWeight
}

export function calculateGuardianWeight(
  keysetJson: string,
  verificationEmailHashs: string[],
): ISendRecoveryAction {
  const keyset = Keyset.fromJson(keysetJson)
  let guardianWeight = 0
  const isPolicy = keyset.keys.length > 3 ? false : true

  for (const item of keyset.keys) {
    const keyEmailDkim = item as KeyEmailDkim
    const roleWeight = item.roleWeight

    if (!keyEmailDkim.emailFrom) {
      continue
    }
    if (!verificationEmailHashs.includes(keyEmailDkim.emailHash)) {
      continue
    }

    guardianWeight += roleWeight.guardianWeight
  }

  if (isPolicy && keyset.keys.length === 3) {
    guardianWeight += keyset.keys[keyset.keys.length - 1].roleWeight.ownerWeight
  }

  const sendRecoveryEmailWeight = getGuardianWeight(guardianWeight, isPolicy)

  return sendRecoveryEmailWeight
}

export async function buildSignKeyset(keysetJson: string, signature: string): Promise<Keyset> {
  const keyset = Keyset.fromJson(keysetJson)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signFunc = (digestHash: utils.BytesLike, signType: SignType) => Promise.resolve(signature)
  const masterKey = keyset.keys[0] as KeySecp256k1
  masterKey.signFunc = signFunc
  keyset.keys[0] = masterKey
  return keyset
}

export async function buildSignMasterKeyKeySet(
  keysetJson: string,
  permit: string,
): Promise<Keyset> {
  console.log({ keysetJson: keysetJson })
  const keyset = Keyset.fromJson(keysetJson)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signFunc = (digestHash: utils.BytesLike, signType: SignType) => Promise.resolve(permit)
  const masterKey = keyset.keys[0] as KeySecp256k1
  masterKey.signFunc = signFunc
  keyset.keys[0] = masterKey
  console.log({ keyset: keyset })
  return keyset
}

export async function generateSessionKey(
  sessionKeyWallet: Wallet,
  timestamp: number,
  permit: string,
  weight: number,
  keysetJson: string,
  chainId: number,
  userAddr: string,
  provider: providers.JsonRpcProvider,
): Promise<SessionKey> {
  const permitDigestHash = digestPermitMessage(
    sessionKeyWallet.address,
    timestamp,
    weight,
    userAddr,
  )
  const keyset = await buildSignMasterKeyKeySet(keysetJson, permit)
  const unipassWallet = new UnipassWallet({ address: userAddr, keyset, provider })
  const unipassPermit = await unipassWallet.signMessage(permitDigestHash, [0], false)
  console.log({ unipassPermit, permit })
  const permitData: IPermit = {
    permit: unipassPermit,
    weight,
    timestamp,
  }

  const sessionKey = new SessionKey(sessionKeyWallet, SignType.EthSign, userAddr, permitData)

  return sessionKey
}

export function sha256Hash(email: string, pepper: string): string {
  if (!email) {
    return ''
  }

  const data = utils.concat([utils.toUtf8Bytes(email), utils.arrayify(pepper)])
  const hash = createHash('sha256').update(data).digest('hex')

  return `0x${hash}`
}

export function getFuzzyEmail(email: string) {
  if (!email) {
    return ''
  }

  const emailData = email.split('@')
  const emailStart = emailData[0][0]
  const emailEnd = emailData[0][emailData[0].length - 1]

  if (email.includes('@')) {
    return `${emailStart}***${emailEnd}@${emailData[1]}`
  }

  return `${emailStart}***${emailEnd}`
}

export function hideSecurityInformation(keysetJson: string) {
  const keyset = Keyset.fromJson(keysetJson)

  const keys = keyset.keys

  for (const [index, item] of keys.entries()) {
    if (index < 2) {
      // register email show info
      continue
    }

    const key = item as KeyEmailDkim

    if (!key.emailFrom) {
      continue
    }

    const hiddenKey = new KeyEmailDkim(
      'Hash',
      getFuzzyEmail(key.emailFrom),
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      key.roleWeight,
      key.getDkimParams(),
      key.emailHash,
    )
    keys[index] = hiddenKey
  }

  return keyset.toJson()
}
