<template>
  <div id="page-connect">
    <up-header-connect />
    <div class="up-connect">
      <div class="user-from">
        <img src="@/assets/img/index/avatar.svg" />
        <div class="to-box">
          <div class="dot"></div>
        </div>
        <img src="@/assets/img/connect/from.svg" />
      </div>
      <div class="info-box">
        <div class="t1">{{ $t('ConnectTitle') }}</div>
        <div class="t2">www.sushi.com</div>
        <div class="t3">{{ $t('ConnectSubtitle') }}</div>
        <div class="line"></div>
        <div class="t4">
          <up-icon name="view" />
          <span>{{ $t('ConnectTip1') }}</span>
        </div>
        <div class="t4">
          <up-icon name="empty" />
          <span>{{ $t('ConnectTip2') }}</span>
        </div>
        <div class="t4">
          <up-icon name="safe" />
          <span>{{ $t('ConnectTip3') }}</span>
        </div>
      </div>
      <div class="btns">
        <up-button type="info" @click="reject">{{ $t('Cancel') }}</up-button>
        <up-button type="primary" @click="approve">{{ $t('Connect') }}</up-button>
      </div>
      <div class="tip">{{ $t('ConnectTip4') }}<br />www.sushi.com</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { UPAccount, UPMessage, UPResponse } from '@unipasswallet/popup-types'
import {
  registerPopupHandler,
  unregisterPopupHandler,
  postMessage,
} from '@unipasswallet/popup-utils'

import { onBeforeUnmount, onMounted } from 'vue'

const isDark = useDark()
onMounted(() => {
  registerPopupHandler((event: MessageEvent) => {
    if (typeof event.data !== 'object') return
    if (event.data.type !== 'UP_LOGIN') return
    try {
      const { payload, appSetting } = event.data as UPMessage
      console.log('payload', payload)
      console.log('appSetting', appSetting)
      if (appSetting?.theme === 'dark') {
        isDark.value = true
      }
      if (appSetting?.theme === 'light') {
        isDark.value = false
      }
    } catch (err) {
      console.log('err', err)
    }
  })
})

onBeforeUnmount(() => {
  unregisterPopupHandler()
})

const userStore = useUserStore()

const approve = () => {
  const user = userStore.user
  postMessage(
    new UPMessage(
      'UP_RESPONSE',
      JSON.stringify(new UPResponse('APPROVE', new UPAccount(user.account, user.email, true))),
    ),
  )
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

<style lang="scss">
#page-connect {
  .up-connect {
    .user-from {
      margin: 28px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 74px;
        height: 74px;
      }
      .to-box {
        margin: 0 20px;
        width: 60px;
        height: 2px;
        background: var(--up-bg-checked);
        border-radius: 1px;
        .dot {
          width: 6px;
          height: 2px;
          background: var(--up-text-third);
          border-radius: 1px;
        }
      }
    }
    .info-box {
      text-align: center;
      padding: 28px 24px 24px;
      background: var(--up-bg);
      border-radius: 12px;
      backdrop-filter: blur(8px);

      .t1 {
        font-size: 20px;
        font-weight: 600;
        line-height: 20px;
      }
      .t2 {
        margin-top: 16px;
        font-size: 20px;
        font-weight: 600;
        line-height: 20px;
        color: var(--up-text-third);
      }
      .t3 {
        margin-top: 16px;
        font-size: 16px;
        font-weight: 400;
        line-height: 16px;
        color: var(--up-text-third);
      }
      .t4 {
        text-align: left;
        font-size: 14px;
        font-weight: 400;
        color: var(--up-text-third);
        line-height: 20px;
        display: flex;
        align-items: center;

        & + .t4 {
          margin-top: 20px;
        }
        .iconpark {
          font-size: 20px;
          margin-right: 10px;
        }
      }
    }
    .tip {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      font-weight: 400;
      color: var(--up-text-third);
      line-height: 20px;
    }
    .line {
      margin: 24px 0;
    }
  }
}
</style>
