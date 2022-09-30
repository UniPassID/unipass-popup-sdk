import { User, useUserStore } from '@/store/user'
import QRCode from 'qrcode'
import dayjs from 'dayjs'
import { ElMessageBox } from 'element-plus'
import assets from '@/service/assets'
import blockchain from '@/service/blockchain'
import { useRecoveryStore } from '@/store/recovery'
import { useUniPass } from '@/utils/useUniPass'
import chainsConfig from '@/service/chains-config'

export const useIndex = () => {
  const { t: $t } = useI18n()
  const router = useRouter()

  const unipass = useUniPass()
  const showReceive = ref(false)
  const userStore = useUserStore()
  const recoveryStore = useRecoveryStore()
  const addressQRCode = ref('')
  const recovering = reactive({
    isPending: false,
    percentage: 0,
    loading: false,
  })

  const sendCoin = (i: number) => {
    const coin = userStore.coins[i]
    router.push({
      path: '/send',
      query: {
        symbol: coin.symbol,
        chain: coin.chain,
      },
    })
  }

  let polling: NodeJS.Timer | undefined
  const cancelRecovery = () => {
    ElMessageBox.prompt('Please input your password.', 'Cancel recovery', {
      confirmButtonText: $t('Confirm'),
      cancelButtonText: $t('Cancel'),
      inputType: 'password',
      inputPattern: /.+/,
      inputErrorMessage: $t('PasswordEmpty'),
    })
      .then(async ({ value: password }) => {
        recovering.loading = true
        const { user } = userStore
        const hash = await recoveryStore.sendCancelRecovery(user as User, password)
        if (hash) {
          const date = dayjs().add(2, 'minute')
          polling = setInterval(async () => {
            const res = await blockchain.getTransactionReceipt(hash)
            if (res) {
              clearInterval(polling)
              if (res.status === 1) {
                unipass.success('Cancel recovery success')
                recovering.loading = false
                recovering.isPending = false
                recovering.percentage = 0
              } else {
                console.error('Cancel recovery failed')
                recovering.loading = false
                // todo error
              }
            }
            // timeout
            if (date.isBefore(dayjs())) {
              clearInterval(polling)
              console.error('Cancel recovery timeout')
              recovering.loading = false
              // todo timeout
            }
          }, 4000)
          return
        }
        recovering.loading = false
      })
      .catch(() => {})
  }

  const initRecovering = async (address: string) => {
    const res = await blockchain.getLockInfo(address)
    if (res.isPending) {
      recovering.isPending = true
      const min = dayjs(res.timestamp * 1000).diff(dayjs(), 'minute')
      const mins = 48 * 60
      recovering.percentage = Math.floor(((mins - min) / mins) * 100)
    }
  }

  const initQRCode = async (block: string) => {
    if (!block) {
      return
    }
    // https://www.npmjs.com/package/qrcode#example-1
    addressQRCode.value = await QRCode.toDataURL(block, {
      type: 'image/png',
      width: 160,
      margin: 0,
      // errorCorrectionLevel: 'L',
      color: {
        dark: '#000000',
        light: '#FFFFFF00',
      },
    })
  }

  // const initAssets = (account: string) => {
  //   userStore.coins = []
  //   for (const chain of chainsConfig) {
  //     assets.getAsset(account, chain).then((token) => {
  //       userStore.coins.push(...token)
  //     })
  //   }
  // }

  const init = async () => {
    const user = userStore.user
    initQRCode(user.account)
    initRecovering(user.account)
    // initAssets(user.account)
    const coins = await assets.getAssets(user.account)
    userStore.coins = coins
  }

  init()
  return {
    recovering,
    cancelRecovery,
    addressQRCode,
    showReceive,
    sendCoin,
    userStore,
  }
}
