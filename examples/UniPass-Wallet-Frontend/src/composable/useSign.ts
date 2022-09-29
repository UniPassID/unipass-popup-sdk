import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'
import { useUniPass } from '@/utils/useUniPass'
import { useSignStore } from '@/store/sign'
import { etherToWei } from '@/service/format-bignumber'
import { ChainType } from '@unipasswallet/provider'
import { utils } from 'ethers'

export const useSign = () => {
  const unipass = useUniPass()
  const userStore = useUserStore()
  const { t: $t } = useI18n()
  const isDark = useDark()
  const router = useRouter()
  const route = useRoute()

  const signStore = useSignStore()
  signStore.init(route.query.chain as string, route.query.symbol as string)

  const sendToken = async (data: any, chain: ChainType) => {
    try {
      const hash = await getSendTokenReq(data)
      if (hash) {
        router.replace({
          path: '/send/loading',
          query: {
            hash: hash,
            chain,
          },
        })
      }
    } catch (error: any) {
      console.error(error)
      unipass.error(error?.message || 'unkonw error')
    }
    signStore.loading = false
  }

  const sign = () => {
    signStore.loading = true
    for (const card of signStore.cards) {
      if (card.type === 'send-token') {
        const coin = userStore.coins.find(
          (e) => e.symbol === card.data.symbol && e.chain === card.data.chain,
        )
        if (coin) {
          const v = Number(card.data.amount) + Number(coin.gasFee)
          if (signStore.feeSymbol === coin.symbol && v > Number(coin.balance)) {
            ElMessageBox.confirm($t('InsufficientBalanceWarning'), $t('Warning'), {
              confirmButtonText: $t('Confirm'),
              cancelButtonText: $t('Cancel'),
            })
              .then(() => {
                sendToken(card.data, coin.chain)
              })
              .catch(() => {
                signStore.loading = false
              })
          } else {
            sendToken(card.data, coin.chain)
          }
        }
      }
    }
  }

  const getSendTokenReq = async (data: any) => {
    const coin = userStore.coins.find((e) => e.symbol === data.symbol && e.chain === data.chain)
    if (!coin) {
      console.error('not found coin')
      return
    }
    const fee = userStore.coins.find(
      (e) => e.symbol === signStore.feeSymbol && e.chain === data.chain,
    )
    if (!fee) {
      console.error('not found fee')
      return
    }
    const unipassWallet = userStore.unipassWallet
    if (coin.contractAddress === '0x0000000000000000000000000000000000000000') {
      const res = await unipassWallet.transaction({
        tx: {
          target: data.address,
          value: etherToWei(data.amount),
          revertOnError: true,
        },
        fee: {
          token: fee.contractAddress,
          value: etherToWei(fee.gasFee, fee.decimals),
        },
        chain: coin.chain,
      })
      return res.transactionHash
    } else {
      const erc20Interface = new utils.Interface(['function transfer(address _to, uint256 _value)'])
      const erc20TokenData = erc20Interface.encodeFunctionData('transfer', [
        data.address,
        etherToWei(data.amount, coin.decimals),
      ])
      const res = await unipassWallet.transaction({
        tx: {
          target: coin.contractAddress,
          value: etherToWei('0'),
          revertOnError: true,
          data: erc20TokenData,
        },
        fee: {
          token: fee.contractAddress,
          value: etherToWei(fee.gasFee, fee.decimals),
        },
        chain: coin.chain,
      })
      return res.transactionHash
    }
  }

  return {
    unipass,
    userStore,
    isDark,
    signStore,
    sign,
  }
}
