import { KeygenData } from '@/service/backend'
import init, {
  li17_p2_key_gen1,
  li17_p2_key_gen2,
  li17_p2_sign1,
  li17_p2_sign2,
} from 'lindell-ecdsa-wasm'

// Temporary hack for getRandomValues() error
const getRandomValues = crypto.getRandomValues
crypto.getRandomValues = function (array: any) {
  const buffer = new Uint8Array(array)
  const value = getRandomValues.call(crypto, buffer)
  array.set(value)
  return array
}

void (async function () {
  try {
    await init()
    self.postMessage({ ready: true })
    console.log('Worker is initializing...')
  } catch (error) {
    console.error('Worker is initializing error', error)
  }
})()

const getP2KeyGen1 = async (tssRes: KeygenData) => {
  const [context2, p2FirstMsg] = await li17_p2_key_gen1(tssRes.msg)
  return [context2, p2FirstMsg]
}

const getP2KeyGen2 = async (tssRes: KeygenData, content2: string) => {
  const [signContext2, pubkey] = await li17_p2_key_gen2(content2, tssRes.msg)
  return [signContext2, pubkey]
}
const getLi17P2Sign1 = async (localKey: any, msgHash: any) => {
  const [context1, message1] = await li17_p2_sign1(localKey, msgHash)
  return [context1, message1]
}
const getLi17P2Sign2 = async (context1: any, msgHash: number[]) => {
  const [partialSig, message2] = await li17_p2_sign2(context1, msgHash)
  return [partialSig, message2]
}

const TssWorker = {
  getP2KeyGen1,
  getP2KeyGen2,
  getLi17P2Sign1,
  getLi17P2Sign2,
}

export default TssWorker
