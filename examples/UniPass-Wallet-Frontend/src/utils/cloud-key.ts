import { syncScrypt } from 'scrypt-js'
import { Wallet } from 'ethers'
import { concat, hexlify, arrayify } from 'ethers/lib/utils'

export async function signMsg(msg: string, privkey: string, isArrayify: boolean): Promise<string> {
  const w = new Wallet(privkey)
  const sig = await w.signMessage(isArrayify ? arrayify(msg) : msg)
  return sig
}

export const generateKdfPassword = (password: string): string => {
  const salt = 'hello unipass wallet'
  const N = 64
  const r = 8
  const p = 1
  const dkLen = 32
  const passwordBuffer = Buffer.from(password, 'utf-8')
  const saltBuffer = Buffer.from(salt, 'utf-8')
  const derivedKey = syncScrypt(passwordBuffer, saltBuffer, N, r, p, dkLen)
  return hexlify(concat([hexlify(new Uint8Array(saltBuffer)), hexlify(derivedKey)]))
}
