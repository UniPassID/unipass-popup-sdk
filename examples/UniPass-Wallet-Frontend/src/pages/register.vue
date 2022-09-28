<template>
  <page-register-password v-if="registerStore.step === 2" @back="back" />
  <page-register v-else />
</template>

<script lang="ts" setup>
import { useRegister } from '@/composable/useRegister'

const { registerStore } = useRegister()

const back = () => {
  // clear password
  registerStore.password = ''
  registerStore.confirmPassword = ''
  registerStore.step = 1
  registerStore.isFocus = false
  registerStore.kdfPassword = ''
}
</script>
