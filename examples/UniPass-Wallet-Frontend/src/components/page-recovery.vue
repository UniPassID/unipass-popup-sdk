<template>
  <div id="page-recovery">
    <up-header />
    <h2>{{ $t('RecoveryTitle') }}</h2>
    <h4>{{ $t('RecoverySubtitle') }}</h4>
    <el-form @submit.prevent ref="formElement" label-position="top" :model="recoveryStore">
      <up-form-item
        :label="recoveryStore.email && $t('Email')"
        prop="email"
        :rules="[{ validator: unipass.checkEmailFormat, trigger: 'blur' }]"
      >
        <up-input
          :placeholder="$t('EmailEmpty')"
          @input="(v) => (recoveryStore.email = unipass.formatEmail(v))"
          @focus="formElement?.clearValidate('email')"
          v-model="recoveryStore.email"
          @keydown.enter="recoveryStore.email && submitEmail()"
          clearable
        />
      </up-form-item>
    </el-form>
    <up-button type="primary" @click="submitEmail" :disabled="!recoveryStore.email">
      {{ $t('NextStep') }}
    </up-button>
  </div>
</template>

<script lang="ts" setup>
import { useRecovery } from '@/composable/useRecovery'
import { useUniPass } from '@/utils/useUniPass'

const unipass = useUniPass()
const { recoveryStore, submitEmail, formElement } = useRecovery()
</script>

<style lang="scss">
#page-recovery {
  .el-form {
    margin-top: 40px;
  }
  .el-button {
    margin-top: 40px;
  }
}
</style>
