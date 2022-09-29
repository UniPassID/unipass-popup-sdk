<template>
  <div id="page-sign">
    <up-header-connect hide-chain />
    <up-sign class="transaction" @cancel="reject" />
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

const { userStore, signStore } = useSign()

onMounted(() => {
  registerPopupHandler((event: MessageEvent) => {
    if (typeof event.data !== 'object') return
    if (event.data.type !== 'UP_TRANSACTION') return
    try {
      const { payload, appSetting } = event.data as UPMessage
      userStore.initAppSetting(appSetting)
      if (appSetting && payload) {
        signStore.initPopUp(appSetting, JSON.parse(payload) as UPTransactionMessage)
      }
    } catch (err) {
      console.error('err', err)
    }
  })
})

onBeforeUnmount(() => {
  unregisterPopupHandler()
})

const reject = () => {
  postMessage(
    new UPMessage(
      'UP_RESPONSE',
      JSON.stringify(new UPResponse('DECLINE', 'user reject signature')),
    ),
  )
}
</script>
