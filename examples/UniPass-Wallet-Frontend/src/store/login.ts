import api from '@/service/backend'
import { signMsg } from '@/utils/cloud-key'
import { generateSessionKey } from '@/utils/session-key'
import dayjs from 'dayjs'
import { useUserStore, User } from '@/store/user'
import router from '@/plugins/router'
import Tss, { SIG_PREFIX } from '@/utils/tss'
import { Keyset } from '@unipasswallet/keys'

export const useLoginStore = defineStore({
  id: 'login',
  state: () => {
    return {
      loading: false,
      email: '',
      password: '',
      token: '',
      step: 1,
    }
  },
  actions: {
    async login(
      keystore: string,
      accountAddress: string,
      localKeyAddress: string,
      upAuthToken: string,
    ) {
      const sessionKey = await generateSessionKey()
      const timestampNow = dayjs().add(1, 'minute').unix()
      const sig = await signMsg(SIG_PREFIX.LOGIN + timestampNow, sessionKey.privkey, false)
      const timestamp = dayjs().add(4, 'hour').unix()
      const weight = Number(process.env.VUE_APP_Permit_Weight)
      const permit = await Tss.generateTssPermit(
        this.email,
        upAuthToken,
        'signIn',
        keystore,
        localKeyAddress,
        this.password,
        timestamp,
        sessionKey.address,
        weight,
        accountAddress,
      )
      const res = await api.queryAccountKeyset({
        email: this.email,
        upAuthToken: '',
        sessionKeyPermit: {
          timestamp: timestamp,
          timestampNow: timestampNow,
          permit: permit,
          sessionKeyAddress: sessionKey.address,
          sig,
          weight,
        },
      })
      if (res.ok) {
        const { masterKeyAddress, accountAddress } = res.data
        const keyset = Keyset.fromJson(res.data.keyset)
        const user: User = {
          email: this.email,
          account: accountAddress,
          keyset: {
            hash: keyset.hash(),
            masterKeyAddress,
            keysetJson: res.data.keyset,
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
          committed: true,
        }
        // login success
        const userStore = useUserStore()
        await userStore.update(user)
        // reset loginStore
        this.$reset()
        router.push('/')
      }
    },
  },
})
