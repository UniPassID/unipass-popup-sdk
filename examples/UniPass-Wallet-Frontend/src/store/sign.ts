import { TransactionType, SignType } from '@/utils/useUniPass'
import { useUserStore } from '@/store/user'
import chainsConfig, { TokenInfo } from '@/service/chains-config'
import router from '@/plugins/router'

interface Card {
  show: boolean
  type: TransactionType
  data: any
}

export const useSignStore = defineStore({
  id: 'sign',
  state: (): {
    type: SignType
    cards: Card[]
    message: string
    feeSymbol: string
    loading: boolean
    authChainNode: string
    coin: TokenInfo
  } => {
    return {
      type: 'message',
      cards: [],
      message: '',
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
    init(symbol: string, chain: string) {
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
