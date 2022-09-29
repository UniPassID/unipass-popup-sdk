<template>
  <div id="page-sign">
    <up-header-connect hide-chain />
    <up-sign class="transaction" />
  </div>
</template>
<script setup lang="ts">
import { useSign } from '@/composable/useSign'
import { UPTransactionMessage, UPMessage, UPResponse } from '@unipasswallet/popup-types'
import {
  registerPopupHandler,
  unregisterPopupHandler,
  postMessage,
} from '@unipasswallet/popup-utils'
import { ElMessage } from 'element-plus'
import { arrayify, toUtf8String } from 'ethers/lib/utils'

const { unipass, userStore, isDark } = useSign()

const auth = reactive({
  loading: false,
  from: '',
  referrer: '',
  to: '',
  value: '',
  data: '',
})

onMounted(() => {
  registerPopupHandler((event: MessageEvent) => {
    if (typeof event.data !== 'object') return
    if (event.data.type !== 'UP_TRANSACTION') return
    try {
      const { payload, appSetting } = event.data as UPMessage
      userStore.initAppSetting(appSetting)
      if (payload) {
        const { from, to, value, data } = JSON.parse(payload) as UPTransactionMessage
        auth.referrer = window.document.referrer
        auth.from = from
        auth.to = to
        auth.value = value
        auth.data = data
        if (auth.from !== userStore.user.account) {
          ElMessage.error('address inconsistent')
        }
      }
    } catch (err) {
      console.error('err', err)
    }
  })
})

onBeforeUnmount(() => {
  unregisterPopupHandler()
})

const approve = async () => {
  const { unipassWallet } = userStore
  auth.loading = true
  // const sig = await unipassWallet.signMessage(auth.msg)
  // postMessage(new UPMessage('UP_RESPONSE', JSON.stringify(new UPResponse('APPROVE', sig))))
  auth.loading = false
}

const reject = () => {
  postMessage(
    new UPMessage(
      'UP_RESPONSE',
      JSON.stringify(new UPResponse('DECLINE', 'user reject signature')),
    ),
  )
}
</script>
