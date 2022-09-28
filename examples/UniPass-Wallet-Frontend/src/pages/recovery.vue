<template>
  <page-recovery-verify v-if="recoveryStore.step === 2" @back="back" />
  <page-recovery-password v-else-if="recoveryStore.step === 3" @back="back" />
  <page-recovery-guardian v-else-if="recoveryStore.step === 4" @back="back" />
  <page-recovery v-else />
</template>

<script lang="ts" setup>
import { useRecoveryStore } from '@/store/recovery'

const recoveryStore = useRecoveryStore()

const back = () => {
  // clear password
  recoveryStore.password = ''
  recoveryStore.confirmPassword = ''
  recoveryStore.step = 1
}
</script>
