// import { AssetTransactionInput } from '@/service/relayer'
import { User, useUserStore } from '@/store/user'
import { FormInstance } from 'element-plus'
import dayjs from 'dayjs'
import { useSignStore } from '@/store/sign'
import api, { SyncTx } from '@/service/backend'
import { decryptSessionKey } from '@/utils/session-key'
import { signMsg } from '@/utils/cloud-key'
import { SIG_PREFIX } from '@/utils/tss'
import { ChainType } from '@unipasswallet/provider'

type IconType = 'success' | 'warning' | 'info' | 'error' | ''

export const useSend = () => {
  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()
  const signStore = useSignStore()
  signStore.init(route.query.chain as string, route.query.symbol as string)

  const form = reactive({
    // mock
    toAddress: '0x61E428AaB6347765eFc549eae7bd740aA886A707',
    toAmount: '0.001',
    coin: signStore.coin,
    coins: userStore.coins,
    showSign: false,
  })
  const formElement = ref<FormInstance>()

  const maxAmount = () => {
    form.toAmount = form.coin.balance
    if (!formElement.value) return
    formElement.value.validateField('toAmount')
  }

  const getSyncAccountTransaction = async (user: User, authChainNode: string): Promise<SyncTx> => {
    const { sessionKey, email } = user

    const timestamp = sessionKey.expires
    const sessionKeyAddress = sessionKey.localKey.address
    const permit = sessionKey.authorization
    const sessionKeyPrivateKey = await decryptSessionKey(
      sessionKey.aesKey,
      sessionKey.localKey.keystore,
    )
    const sig = await signMsg(
      SIG_PREFIX.GET_SYNC_TRANSACTION + timestamp,
      sessionKeyPrivateKey,
      false,
    )
    const weight = Number(process.env.VUE_APP_Permit_Weight)
    const sessionKeyPermit = {
      timestamp: timestamp,
      timestampNow: timestamp,
      permit,
      sessionKeyAddress,
      sig,
      weight,
    }
    const syncTransaction = await api.getSyncTranscation({
      email,
      sessionKeyPermit,
      authChainNode,
    })
    console.info({ syncTransaction })
    return syncTransaction.data
  }

  const submit = () => {
    if (!formElement.value) return
    formElement.value.validate(async (ok: boolean) => {
      if (ok) {
        signStore.cards = [
          {
            show: true,
            type: 'send-token',
            data: {
              amount: form.toAmount,
              address: form.toAddress,
              symbol: form.coin.symbol,
              chain: form.coin.chain,
            },
          },
        ]
        form.showSign = true
      }
    })
  }

  const checkAmount = (_rule: any, v: string, callback: (err?: Error) => void) => {
    const amount = Number(v)
    if (Number.isNaN(amount)) {
      return callback(new Error('Invalid input'))
    }
    if (amount <= 0) {
      return callback(new Error('Invalid input'))
    }
    if (amount > Number(form.coin.balance)) {
      return callback(new Error('Invalid input'))
    }
    callback()
  }

  const back = () => {
    if (form.showSign) {
      form.showSign = false
    } else {
      router.back()
    }
  }

  // init
  signStore.feeSymbol = ''

  return {
    back,
    checkAmount,
    formElement,
    form,
    maxAmount,
    submit,
    getSyncAccountTransaction,
  }
}

export const useSendLoading = () => {
  // const userStore = useUserStore()
  const route = useRoute()
  const hash = (route.query.hash as string) || ''
  const chain = (route.query.chain as ChainType) || ''
  const icon = ref<IconType>('success')
  const title = ref('Send Successfully')

  // let polling: NodeJS.Timer | undefined
  // onBeforeMount(async () => {
  //   const date = dayjs().add(2, 'minute')
  //   polling = setInterval(async () => {
  //     const wallet = await userStore.unipassWallet.wallet(chain)
  //     const res = await wallet.provider?.getTransactionReceipt(hash)
  //     if (res) {
  //       clearInterval(polling)
  //       if (res.status === 1) {
  //         icon.value = 'success'
  //         title.value = 'Send Successfully'
  //       } else {
  //         icon.value = 'error'
  //         title.value = 'Send Failed'
  //       }
  //     }
  //     // timeout
  //     if (date.isBefore(dayjs())) {
  //       clearInterval(polling)
  //       icon.value = 'warning'
  //       title.value = 'Send Timeout'
  //     }
  //   }, 4000)
  // })
  // onUnmounted(() => {
  //   clearInterval(polling)
  // })

  const explorer = computed(() => {
    if (chain === 'polygon') {
      return process.env.VUE_APP_Polygon_Explorer
    } else if (chain === 'bsc') {
      return process.env.VUE_APP_BSC_Explorer
    } else if (chain === 'rangers') {
      return process.env.VUE_APP_Rangers_Explorer
    }
  })

  return {
    icon,
    title,
    explorer,
    hash,
  }
}
