<template>
  <div id="page-sign-message">
    <up-header-connect hide-chain />
    <up-sign class="message">
      <template #main>
        <div class="t1">{{ $t('RequestSignature') }}</div>
        <div class="t2">{{ $t('Details') }}</div>
        <div class="line"></div>
        <div class="label">{{ $t('Signatory') }}</div>
        <div class="user">
          <div class="left">
            <img src="@/assets/img/index/avatar.svg" />
          </div>
          <div class="right">
            <div class="email">{{ userStore.user.email }}</div>
            <div class="address">{{ unipass.formatAddress(userStore.user.account) }}</div>
          </div>
        </div>
        <div class="label">{{ $t('FromWeb') }}</div>
        <div class="from">
          <img src="@/assets/img/connect/from.svg" />
          <span>{{ auth.referrer }}</span>
        </div>
        <div class="label">{{ $t('Message') }}</div>
        <el-input type="textarea" :rows="8" resize="none" v-model="auth.msg" readonly />
      </template>
      <template #footer>
        <div class="btns">
          <up-button type="info" @click="reject" :disabled="auth.loading">
            {{ $t('Cancel') }}
          </up-button>
          <up-button type="primary" @click="approve" :loading="auth.loading">
            {{ $t('Sign') }}
          </up-button>
        </div>
      </template>
    </up-sign>
  </div>
</template>

<script setup lang="ts">
import { useSign } from '@/composable/useSign'
import { UPAuthMessage, UPMessage, UPResponse } from '@unipasswallet/popup-types'
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
  msg: '',
  from: '',
  referrer: '',
})

onMounted(() => {
  registerPopupHandler((event: MessageEvent) => {
    if (typeof event.data !== 'object') return
    if (event.data.type !== 'UP_SIGN_MESSAGE') return
    try {
      const { payload, appSetting } = event.data as UPMessage
      userStore.initAppSetting(appSetting)
      if (payload) {
        const { from, msg } = JSON.parse(payload) as UPAuthMessage
        auth.msg = toUtf8String(arrayify(msg))
        auth.referrer = window.document.referrer
        auth.from = from
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
  const sig = await unipassWallet.signMessage(auth.msg)
  postMessage(new UPMessage('UP_RESPONSE', JSON.stringify(new UPResponse('APPROVE', sig))))
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
