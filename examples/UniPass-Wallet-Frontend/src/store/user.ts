import { AppSettings } from '@unipasswallet/popup-types'
import { TokenInfo } from '@/service/chains-config'
import db from '@/store/db'
import UnipassWalletProvider from '@unipasswallet/provider'
import router from '@/plugins/router'

export type StepType = 'register' | 'recovery'

export interface User {
  email: string
  account: string
  keyset: {
    hash: string
    masterKeyAddress: string
    keysetJson: string
  }
  sessionKey: {
    localKey: {
      keystore: string
      address: string
    }
    aesKey: CryptoKey
    authorization: string
    expires: number
    weight: number
  }
  committed: boolean
  step?: StepType
  stepData?: any
}

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => {
    // env = dev | test | prod
    // const env = process.env.VUE_APP_Net === 'testnet' ? 'test' : 'prod'
    return {
      unipassWallet: UnipassWalletProvider.getInstance({
        env: 'dev',
        relayer_config: {
          bsc: 'https://d.wallet.unipass.vip/relayer-bsc',
          rangers: 'https://d.wallet.unipass.vip/relayer-rangers',
          polygon: 'https://d.wallet.unipass.vip/relayer-polygon',
        },
      }),
      user: {
        email: '',
        account: '',
        keyset: {
          hash: '',
          masterKeyAddress: '',
          keysetJson: '',
        },
        sessionKey: {
          localKey: {
            keystore: '',
            address: '',
          },
          // aesKey: CryptoKey
          authorization: '',
          expires: 0,
          weight: 0,
        },
        committed: false,
      } as User,
      // https://test.wallet.unipass.id/api/v1/config
      mailServices: [] as string[],
      policyAddress: '',
      // frontend
      coins: [
        {
          chain: 'polygon',
          symbol: 'MATIC',
          decimals: 18,
          balance: '0',
          gasFee: '0.00001',
          contractAddress: '0x0000000000000000000000000000000000000000',
        },
        {
          chain: 'bsc',
          symbol: 'BNB',
          decimals: 18,
          balance: '0',
          gasFee: '0.00001',
          contractAddress: '0x0000000000000000000000000000000000000000',
        },
        {
          chain: 'rangers',
          symbol: 'RPG',
          decimals: 18,
          balance: '0',
          gasFee: '0.00001',
          contractAddress: '0x0000000000000000000000000000000000000000',
        },
      ] as TokenInfo[],
      showSupportEmail: false,
      showHeaderMore: false,
      // popup-sdk
      path: '',
      appSetting: {
        chain: 'polygon',
        theme: 'dark',
        appName: '',
        appIcon: '',
      } as AppSettings,
    }
  },
  actions: {
    async initAppSetting(appSetting?: AppSettings) {
      const isDark = useDark()
      if (appSetting) {
        const { theme, chain, appName, appIcon } = appSetting
        if (theme === 'dark') {
          isDark.value = true
        } else if (theme === 'light') {
          isDark.value = false
        }
        if (chain) this.appSetting.chain = chain
        if (appName) this.appSetting.appName = chain
        if (appIcon) this.appSetting.appIcon = chain
      }
    },
    async update(user: User) {
      this.user = user
      await db.setUser(user)
      localStorage.setItem('email', user.email)
    },
    async exit(refresh = false) {
      await this.unipassWallet.logout()
      localStorage.removeItem('email')
      if (refresh) {
        window.location.replace('/login')
      } else {
        router.replace('/login')
      }
    },
  },
})
