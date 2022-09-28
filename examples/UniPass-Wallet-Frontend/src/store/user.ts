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
  id: 'user',
  state: () => {
    // env = dev | test | prod
    const env = process.env.VUE_APP_Net === 'testnet' ? 'test' : 'prod'
    return {
      unipassWallet: UnipassWalletProvider.getInstance({ env }),
      user: {} as User,
      // https://test.wallet.unipass.id/api/v1/config
      mailServices: [] as string[],
      policyAddress: '',
      // config
      path: '',
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
    }
  },
  actions: {
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
