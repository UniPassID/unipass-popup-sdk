import { TransactionType, upError } from '@/utils/useUniPass'
import { useUserStore } from '@/store/user'
import chainsConfig, { TokenInfo } from '@/service/chains-config'
import router from '@/plugins/router'
import { AppSettings, UPTransactionMessage } from '@unipasswallet/popup-types'
import { formatEther } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'

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
    initPopUp(appSetting: AppSettings, payload: UPTransactionMessage) {
      const userStore = this.userStore
      const chain = appSetting.chain || userStore.appSetting.chain
      if (chain) {
        const coin = userStore.coins.find(
          (e) =>
            e.chain === chain && e.contractAddress === '0x0000000000000000000000000000000000000000',
        )
        if (coin) {
          this.init(coin.chain, coin.symbol)
          if (payload.from === userStore.user.account) {
            this.cards = [
              {
                show: true,
                type: 'send-token',
                data: {
                  amount: formatEther(BigNumber.from(payload.value)),
                  address: payload.to,
                  symbol: coin.symbol,
                  chain: coin.chain,
                },
              },
            ]
          } else {
            upError('address inconsistent')
          }
        } else {
          upError('not found coin')
        }
      } else {
        upError('not found chain')
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
