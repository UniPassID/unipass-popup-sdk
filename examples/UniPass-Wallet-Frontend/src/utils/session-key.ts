import { Wallet } from 'ethers'
import { arrayify, concat, hexlify, randomBytes } from 'ethers/lib/utils'

async function encryptSessionKey(privkey: string, aesKey: CryptoKey): Promise<string> {
  const iv = randomBytes(16)
  // use subtle aes key to encrypt privkey
  const encryptedPrivkey = await window.crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv,
    },
    aesKey,
    arrayify(privkey),
  )

  return hexlify(concat([hexlify(iv), hexlify(new Uint8Array(encryptedPrivkey))]))
}

export async function decryptSessionKey(
  aesKey: CryptoKey,
  encryptedPrivkey: string,
): Promise<string> {
  // use subtle aes key to decrypt privkey

  const buffer = arrayify(encryptedPrivkey)

  const privkey = await window.crypto.subtle.decrypt(
    {
      name: 'AES-CBC',
      iv: buffer.slice(0, 16),
    },
    aesKey,
    buffer.slice(16),
  )

  return hexlify(new Uint8Array(privkey))
}

export async function generateSessionKey() {
  const w = Wallet.createRandom()

  const privkey = w.privateKey
  const address = w.address

  const aesKey = await window.crypto.subtle.generateKey(
    {
      name: 'AES-CBC',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt'],
  )

  const encryptedKey = await encryptSessionKey(privkey, aesKey)

  return {
    privkey,
    address,
    aesKey,
    encryptedKey,
  }
}
