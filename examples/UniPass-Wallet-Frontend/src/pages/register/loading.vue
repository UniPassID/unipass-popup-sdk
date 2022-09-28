<template>
  <div id="page-register-loading">
    <up-header />
    <el-button loading size="large" link></el-button>
    <div>{{ $t('Registering') }}</div>
  </div>
</template>

<script lang="ts" setup>
import { useRegisterLoading } from '@/composable/useRegister'

useRegisterLoading()
</script>
