import api from '@/service/backend'
import blockchain from '@/service/blockchain'
import { generateKdfPassword, signMsg } from '@/utils/cloud-key'
import { buildSignKeyset, updateKeyset } from '@/utils/rbac'
import { decryptSessionKey, generateSessionKey } from '@/utils/session-key'
import Tss, { SIG_PREFIX } from '@/utils/tss'
import dayjs from 'dayjs'
import { Wallet } from '@unipasswallet/wallet'

import { CancelLockKeysetHashTxBuilder } from '@unipasswallet/transaction-builders'
import { User, useUserStore } from './user'
import { RpcRelayer } from '@unipasswallet/relayer'
import { unipassWalletContext } from '@unipasswallet/network/dist'
import { constants } from 'ethers'

export const useRecoveryStore = defineStore({
  id: 'recovery',
  state: () => {
    return {
      email: '',
      token: '',
      password: '',
      confirmPassword: '',
      step: 1,
      loading: false,
      canSendStartRecoveryTx: false,
      isHaveTimeLock: false,
      verificationEmailHashs: [] as string[],
    }
  },
  actions: {
    async uploadCloudKey() {
      const resKeyset = await api.queryAccountKeyset({
        email: this.email,
        upAuthToken: this.token,
        sessionKeyPermit: {},
      })

      if (!resKeyset.ok) {
        return
      }
      const { keyset, accountAddress } = resKeyset.data

      const action = 'sendRecoveryEmail'
      const localKeyData = await Tss.generateLocalKey(
        {
          email: this.email,
          upAuthToken: this.token,
          action,
        },
        this.password,
      )
      if (!localKeyData) {
        return
      }

      this.token = localKeyData.upAuthToken
      const masterKeyAddress = localKeyData.localKeyAddress
      const newKeyset = updateKeyset(keyset, masterKeyAddress)
      const newKeysetHash = newKeyset.hash()
      const kdfPassword = generateKdfPassword(this.password)
      const timestamp = dayjs().add(4, 'hour').unix()
      const sessionKey = await generateSessionKey()
      const weight = Number(process.env.VUE_APP_Permit_Weight)
      const permit = await Tss.generateTssPermit(
        this.email,
        this.token,
        action,
        localKeyData.keystore,
        masterKeyAddress,
        this.password,
        timestamp,
        sessionKey.address,
        weight,
        accountAddress,
      )
      const sig = await signMsg(SIG_PREFIX.UPLOAD + timestamp, sessionKey.privkey, false)

      const sessionKeyPermit = {
        timestamp: timestamp,
        timestampNow: timestamp,
        permit: permit,
        sessionKeyAddress: sessionKey.address,
        sig,
        weight,
      }
      const resToken = await api.uploadRecoveryMasterKey({
        email: this.email,
        upAuthToken: this.token,
        masterKey: {
          kdfPassword,
          masterKeyAddress,
          keyStore: localKeyData.keystore,
        },
        sessionKeyPermit,
      })
      // cloud key
      if (!resToken.ok) {
        return
      }

      const { upAuthToken } = resToken.data

      const user: User = {
        email: this.email,
        account: accountAddress,
        keyset: {
          hash: newKeysetHash,
          masterKeyAddress,
          keysetJson: newKeyset.toJson(),
        },
        sessionKey: {
          localKey: {
            keystore: sessionKey.encryptedKey,
            address: sessionKey.address,
          },
          aesKey: sessionKey.aesKey,
          authorization: permit,
          expires: timestamp,
          weight: 100,
        },
        committed: false,
        step: 'recovery',
        stepData: upAuthToken,
      }
      const userStore = useUserStore()
      await userStore.update(user)
      this.step = 4
    },
    async sendCancelRecovery(user: User, password: string) {
      const sessionKeyPrivateKey = await decryptSessionKey(
        user.sessionKey.aesKey,
        user.sessionKey.localKey.keystore,
      )
      const sessionKeyAddress = user.sessionKey.localKey.address
      const timestampNow = dayjs().add(10, 'minute').unix()
      const sig = await signMsg(SIG_PREFIX.LOGIN + timestampNow, sessionKeyPrivateKey, false)
      const timestamp = user.sessionKey.expires
      const weight = Number(process.env.VUE_APP_Permit_Weight)
      const res = await api.queryAccountKeystore({
        email: user.email,
        kdfPassword: generateKdfPassword(password),
        // todo captchaToken
        captchaToken: '',
        sessionKeyPermit: {
          timestamp,
          timestampNow,
          permit: user.sessionKey.authorization,
          sessionKeyAddress,
          sig,
          weight,
        },
      })
      if (!res.ok) {
        return
      }
      const accountAddress = user.account
      const metaNonce = await blockchain.getMetaNonce(accountAddress)
      const txBuilder = new CancelLockKeysetHashTxBuilder(accountAddress, metaNonce, false)
      const digestHash = txBuilder.digestMessage()

      const action = 'signIn'
      const signature = await Tss.generateTssTxSignature(
        user.email,
        res.data.upAuthToken,
        action,
        res.data.keystore,
        res.data.localKeyAddress,
        password,
        digestHash,
      )
      const keyset = await buildSignKeyset(user.keyset.keysetJson, signature)
      const relayer = new RpcRelayer(
        process.env.VUE_APP_Relayer as string,
        unipassWalletContext,
        blockchain.getProvider(),
      )
      const keyWallet = new Wallet({
        address: user.account,
        keyset,
        provider: blockchain.getProvider(),
        relayer: relayer,
      })
      console.log(keyWallet)
      const nonce = await keyWallet.relayer?.getNonce(keyWallet.address)

      let tx = (await txBuilder.generateSignature(keyWallet, [0])).build()

      console.log({ tx })
      const transactionData = await keyWallet.toTransaction(
        {
          type: 'Execute',
          transactions: [tx],
          sessionKeyOrSignerIndex: [],
          gasLimit: constants.Zero,
        },
        nonce,
      )
      tx = transactionData[0]
      console.log({ transactionData })
      txBuilder.signature
      console.log({ signature: txBuilder.signature, gasLimit: tx.gasLimit })
      const cancelResData = await api.cancelRecovery({
        email: user.email,
        metaNonce,
        signature: txBuilder.signature,
        transaction: {
          callType: tx.callType,
          gasLimit: tx.gasLimit.toHexString(),
          target: tx.target,
          value: tx.gasLimit.toHexString(),
          data: tx.data,
        },
      })
      if (cancelResData.ok) {
        return cancelResData.data.transactionHash
      }
    },
  },
})
