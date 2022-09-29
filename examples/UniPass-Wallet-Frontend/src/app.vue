<template>
  <div class="up-app">
    <!-- <div class="up-banner">
      {{ $t('UpBanner') }}
    </div> -->
    <div v-if="gasType === 'unacceptable'" class="under-construction">
      <img src="/img/under-construction.png" alt="under construction" />
    </div>
    <router-view v-if="inited && gasType === 'acceptable'" class="page" />
    <dialog-support-email />
    <dialog-header-more />
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import router from '@/plugins/router'
import api from '@/service/backend'
import { useUserStore } from '@/store/user'
import db from '@/store/db'

const userStore = useUserStore()
const gasType = ref('')

const initGasFee = async () => {
  const res = await axios({
    url: 'https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=6QQXQ81TGYF8NBGUDK86W17R4UMBBMRPEU',
  })
  if (res.data && res.data.message === 'OK') {
    const FastGasPrice = Number(res.data.result.FastGasPrice)
    if (FastGasPrice < 20000) {
      gasType.value = 'acceptable'
    } else {
      gasType.value = 'unacceptable'
    }
  }
  if (gasType.value === '') {
    gasType.value = 'unacceptable'
  }
}
const initSuffixes = async () => {
  const res = await api.getConfig()
  if (res.ok) {
    userStore.mailServices = res.data.suffixes
    userStore.policyAddress = res.data.policyAddress
  } else {
    router.push('/404')
  }
}
const initUser = async () => {
  const { pathname, search, hash } = window.location
  // not need user
  for (const path of ['/login', '/register', '/recovery', '/404']) {
    if (pathname.startsWith(path)) {
      inited.value = true
      return
    }
  }
  // userStore.path
  for (const path of ['/connect', '/sign-message', '/send-transaction']) {
    if (pathname.startsWith(path)) {
      userStore.path = pathname + search + hash
    }
  }

  const user = await db.getUser()
  if (user) {
    userStore.update(user)
  } else {
    userStore.exit()
  }
  inited.value = true

  const unipassWallet = userStore.unipassWallet
  unipassWallet.isLoggedIn().then((isLoggedIn) => {
    if (!isLoggedIn) userStore.exit()
  })
}

const inited = ref(false)
const init = () => {
  initSuffixes()
  initGasFee()
  initUser()
}
init()
</script>

<style lang="scss">
// app
.up-app {
  min-height: 100vh;

  > .page {
    margin: 0 auto;
    max-width: 480px;
    min-height: 100vh;
    overflow: hidden;
    // padding: 0 24px 24px;
    padding: 24px;
    text-align: center;
    background-color: var(--up-background);
    background-image: url('./assets/img/bg-light.svg');
    background-size: cover;
  }
  > .under-construction {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    > img {
      pointer-events: none;
      width: 50%;
      max-height: 80%;
      min-width: 360px;
      object-fit: contain;
    }
  }
  > .up-banner {
    background-color: #fdf0b4;
    color: #606266;
    font-size: 14px;
    padding: 4px 8px;
  }
}

html.dark {
  .up-app {
    > .page {
      background-image: url('./assets/img/bg-dark.svg');
    }
  }
}

// pc
@media screen and (min-width: 480px) {
  // app
  .up-app {
    // padding-top: 5rem;
    padding-bottom: 5rem;
    background-image: linear-gradient(to right, #4299e1, #38b2ac);
    > .up-banner {
      margin-bottom: 5rem;
    }
    > .page {
      min-height: 600px;
      border-radius: 1rem;
    }
  }
  // dark
  html.dark {
    .up-app {
      background: transparent;
    }
  }
}
</style>
