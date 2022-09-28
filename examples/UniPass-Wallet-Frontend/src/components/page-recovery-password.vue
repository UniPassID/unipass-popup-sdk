<template>
  <div id="page-recovery-password">
    <up-header :back="() => $emit('back')" />
    <h2>{{ $t('RecoveryPasswordTitle') }}</h2>
    <h4>{{ $t('RecoveryPasswordSubtitle') }}</h4>
    <el-form @submit.prevent ref="formElement" label-position="top" :model="recoveryStore">
      <up-form-item
        :label="recoveryStore.password && $t('Password')"
        prop="password"
        :rules="[{ validator: unipass.checkPassword, trigger: 'blur' }]"
      >
        <up-input
          :placeholder="$t('PasswordEmpty')"
          @input="(v) => (recoveryStore.password = unipass.formatPassword(v))"
          v-model="recoveryStore.password"
          @keydown.enter="recoveryStore.password && submitPassword()"
          @focus="formElement?.clearValidate('password')"
          show-password
          :disabled="recoveryStore.loading"
        />
      </up-form-item>
      <up-form-item
        :label="recoveryStore.confirmPassword && $t('ConfirmPassword')"
        prop="confirmPassword"
        :rules="[{ validator: checkConfirmPassword, trigger: 'blur' }]"
      >
        <up-input
          v-model="recoveryStore.confirmPassword"
          @keydown.enter="recoveryStore.password && submitPassword()"
          @focus="formElement?.clearValidate('confirmPassword')"
          show-password
          :disabled="recoveryStore.loading"
          :placeholder="$t('PleaseConfirmPassword')"
        />
      </up-form-item>
    </el-form>
    <up-button
      class="submit"
      type="primary"
      :loading="recoveryStore.loading"
      :disabled="!recoveryStore.password"
      @click="submitPassword"
    >
      {{ $t('NextStep') }}
    </up-button>
  </div>
</template>

<script lang="ts" setup>
import { useRecovery } from '@/composable/useRecovery'
import { useUniPass } from '@/utils/useUniPass'

const unipass = useUniPass()
const { recoveryStore, formElement, submitPassword, checkConfirmPassword } = useRecovery()
</script>

<style lang="scss">
#page-recovery-password {
  h2 {
    margin-top: 40px;
  }
  .el-form {
    margin-top: 40px;
    .el-form-item + .el-form-item {
      margin-top: 20px;
    }
  }
  .submit {
    margin-top: 40px;
  }
}
</style>
