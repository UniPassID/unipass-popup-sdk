<template>
  <div id="page-recovery-verify">
    <up-header :back="() => $emit('back')" />
    <h2>{{ $t('EmailVerify') }}</h2>
    <h4>
      {{ $t('PleaseEnterEmailCode', { data: recoveryStore.email }) }}
    </h4>
    <el-form @submit.prevent ref="formElement" :model="form">
      <up-form-item prop="emailCode" :label="form.emailCode && $t('EmailCode')">
        <up-input
          :placeholder="$t('EmailCodeEmpty')"
          v-model="form.emailCode"
          :disabled="form.loading"
          @keydown.enter="form.emailCode && verifyEmailCode()"
          type="tel"
          maxlength="6"
          @input="(v) => (form.emailCode = v.replaceAll(/\D/g, ''))"
        >
          <template #suffix>
            <el-button
              class="send-code"
              :loading="form.emailCodeLoading"
              :disabled="form.count > 0 || form.loading"
              link
              @click="fetchEmailCode"
            >
              <template v-if="form.count > 0"> {{ form.count }}s </template>
              <template v-else>{{ $t('FetchEmailCode') }}</template>
            </el-button>
          </template>
        </up-input>
      </up-form-item>
    </el-form>
    <up-button
      class="submit"
      type="primary"
      :loading="form.loading"
      :disabled="!form.emailCode"
      @click="verifyEmailCode"
    >
      {{ $t('Submit') }}
    </up-button>
  </div>
</template>

<script lang="ts" setup>
import { useEmailCode } from '@/composable/useCode'
import { useRecoveryStore } from '@/store/recovery'

const recoveryStore = useRecoveryStore()

const { form, formElement, fetchEmailCode, verifyEmailCode } = useEmailCode(
  'sendRecoveryEmail',
  recoveryStore.email,
  (token: string) => {
    recoveryStore.token = token
    recoveryStore.step = 3
  },
)
</script>

<style lang="scss">
#page-recovery-verify {
  .el-form {
    margin-top: 29px;
  }
  .submit {
    margin-top: 40px;
  }
}
</style>
