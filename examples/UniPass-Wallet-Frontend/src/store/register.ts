import { generateSessionKey } from '@/utils/session-key'
import dayjs from 'dayjs'
import { signMsg } from '@/utils/cloud-key'
import api, { GuardianData, SignUpAccountInput } from '@/service/backend'
import { User, useUserStore } from '@/store/user'
import router from '@/plugins/router'
import blockchain from '@/service/blockchain'
import Tss, { SIG_PREFIX } from '@/utils/tss'
import { getAccountKeysetJson, sha256Hash } from '@/utils/rbac'
import { GuardiansInfo } from '@/composable/useGuardian'
import { Wallet } from 'ethers'

export const useRegisterStore = defineStore({
  id: 'registerStore',
  state: () => {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      kdfPassword: '',
      token: '',
      guardians: [] as GuardiansInfo[],
      step: 1,
      isFocus: false,
    }
  },
  getters: {
    userStore() {
      return useUserStore()
    },
  },
  actions: {
    async register() {
      this.isFocus = true
      const action = 'signUp'
      const pepper = Wallet.createRandom().privateKey
      const localKeyData = await Tss.generateLocalKey(
        {
          email: this.email,
          upAuthToken: this.token,
          action,
        },
        this.password,
      )
      if (!localKeyData) {
        this.$reset()
        return
      }
      this.token = localKeyData.upAuthToken

      const kdfPassword = this.kdfPassword
      const keyStore = localKeyData.keystore
      const guardianData: GuardianData[] = []
      for (const guardian of this.guardians) {
        const pepper = Wallet.createRandom().privateKey
        guardianData.push({
          email: guardian.recoveryEmail,
          emailHash: sha256Hash(guardian.recoveryEmail, pepper),
          pepper,
          isSelfGuardian: guardian.isSelfGuardian,
        })
      }

      const policyAddress = this.userStore.policyAddress
      const keyset = getAccountKeysetJson(
        guardianData,
        this.email,
        localKeyData.localKeyAddress,
        policyAddress,
        pepper,
      )
      const keysetHash = keyset.hash()
      // // only register use
      const accountAddress = blockchain.generateAccountAddress(keysetHash)
      if (!accountAddress) {
        // todo error deployer
        console.log('err', 'init deployer')
        return
      }

      const timestamp = dayjs().add(4, 'hour').unix()
      const sessionKey = await generateSessionKey()
      const weight = Number(process.env.VUE_APP_Permit_Weight)
      const permit = await Tss.generateTssPermit(
        this.email,
        this.token,
        action,
        localKeyData.keystore,
        localKeyData.localKeyAddress,
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

      const data: SignUpAccountInput = {
        email: this.email,
        pepper,
        upAuthToken: this.token,
        keysetJson: keyset.toJson(),
        masterKey: {
          kdfPassword,
          masterKeyAddress: localKeyData.localKeyAddress,
          keyStore,
        },
        sessionKeyPermit,
      }

      const res = await api.signUpAccount(data)
      if (res.ok) {
        if (res.data.address !== accountAddress) {
          console.log('err', 'accountAddress inconsistent')
        }
      } else {
        console.log('err', res)
      }
      const userStore = useUserStore()
      const user: User = {
        email: data.email,
        account: accountAddress,
        keyset: {
          hash: keysetHash,
          masterKeyAddress: localKeyData.localKeyAddress,
          keysetJson: keyset.toJson(),
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
        step: 'register',
      }
      await userStore.update(user)
      // reset registerStore
      this.$reset()
      router.push({
        path: '/register/loading',
        query: {
          email: user.email,
        },
      })
    },
  },
})
