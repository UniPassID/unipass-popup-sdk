<template>
  <page-login-verify v-if="loginStore.step === 2" @back="back" />
  <page-login v-else />
</template>
<script lang="ts" setup>
import { useLoginStore } from '@/store/login'

const loginStore = useLoginStore()

const back = () => {
  // clear password
  loginStore.password = ''
  loginStore.step = 1
}
</script>
