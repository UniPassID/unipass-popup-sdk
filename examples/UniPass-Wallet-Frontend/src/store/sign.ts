import { TransactionType } from '@/utils/useUniPass'
import { useUserStore } from '@/store/user'
import chainsConfig, { TokenInfo } from '@/service/chains-config'
import router from '@/plugins/router'
import { AppSettings } from '@unipasswallet/popup-types'

interface Card {
  show: boolean
  type: TransactionType
  data: any
}

export const useSignStore = defineStore({
  id: 'signStore',
  state: (): {
    cards: Card[]
    feeSymbol: string
    loading: boolean
    authChainNode: string
    coin: TokenInfo
  } => {
    return {
      cards: [],
      feeSymbol: '',
      loading: false,
      authChainNode: '',
      coin: {
        chain: 'polygon',
        symbol: 'MATIC',
        decimals: 18,
        balance: '0',
        gasFee: '0.00001',
        contractAddress: '0x0000000000000000000000000000000000000000',
      },
    }
  },
  getters: {
    userStore() {
      return useUserStore()
    },
  },
  actions: {
    initAppSetting(appSetting?: AppSettings) {
      const userStore = this.userStore
      if (appSetting) {
        const { chain } = appSetting
        if (chain) {
          const coin = userStore.coins.find(
            (e) =>
              e.chain === chain &&
              e.contractAddress === '0x0000000000000000000000000000000000000000',
          )
          if (coin) this.init(coin.chain, coin.symbol)
        }
      }
    },
    init(chain: string, symbol: string) {
      const userStore = this.userStore
      const coin = userStore.coins.find((e) => e.symbol === symbol && e.chain === chain)
      console.log('coin', coin)
      if (coin) {
        this.coin = coin
      } else {
        router.back()
      }
      this.authChainNode = this.getAuthChainNode(this.coin.chain)
    },
    getAuthChainNode(chain: string) {
      for (const item of chainsConfig) {
        if (item.chain === chain) {
          return item.authChainNode
        }
      }
      return ''
    },
  },
})
