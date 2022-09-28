<template>
  <div id="page-register-password">
    <up-header :back="() => $emit('back')" />
    <h2>{{ $t('RegisterPasswordTitle') }}</h2>
    <h4>{{ $t('RegisterPasswordSubtitle') }}</h4>
    <div class="up-puzzle">
      <el-form @submit.prevent ref="formCodeElement" :model="formCode">
        <div class="key">
          <img src="@/assets/img/register/key-blue.svg" />
          <div class="info">
            <h3>{{ $t('Puzzle') }}1</h3>
            <h4>{{ $t('VerifyYourEmail') }}</h4>
          </div>
        </div>
        <up-form-item prop="emailCode" :label="formCode.emailCode && $t('EmailCode')">
          <up-input
            :placeholder="$t('EmailCodeEmpty')"
            v-model="formCode.emailCode"
            :disabled="formCode.loading"
            @focus="formCode.isFocus = true"
            type="tel"
            maxlength="6"
            @input="(v) => (formCode.emailCode = v.replaceAll(/\D/g, ''))"
          >
            <template #suffix>
              <el-button
                class="send-code"
                :loading="formCode.emailCodeLoading"
                :disabled="formCode.count > 0 || formCode.loading"
                link
                @click="fetchEmailCode"
              >
                <template v-if="formCode.count > 0"> {{ formCode.count }}s </template>
                <template v-else>{{ $t('FetchEmailCode') }}</template>
              </el-button>
            </template>
          </up-input>
        </up-form-item>
        <up-button
          v-if="formCode.isFocus && !formCode.token"
          class="mold"
          type="primary"
          :loading="formCode.loading"
          :disabled="!formCode.emailCode"
          @click="moldCode"
        >
          {{ $t('Mold') }}
        </up-button>
        <div class="mask" v-if="formCode.token">
          <img src="@/assets/img/register/mold-blue.svg" />
          <div class="mold-success">{{ $t('CastingSuccess') }}</div>
        </div>
      </el-form>
    </div>
    <div class="up-puzzle">
      <el-form @submit.prevent ref="formElement" :model="registerStore">
        <div class="key">
          <img src="@/assets/img/register/key-green.svg" />
          <div class="info">
            <h3>{{ $t('Puzzle') }}2</h3>
            <h5>{{ $t('SetAPpassword') }}</h5>
          </div>
        </div>
        <up-form-item
          :label="registerStore.password && $t('Password')"
          prop="password"
          :rules="[{ validator: unipass.checkPassword, trigger: 'blur' }]"
        >
          <up-input
            :placeholder="$t('PasswordEmpty')"
            @input="(v: string) => (registerStore.password = unipass.formatPassword(v))"
            v-model="registerStore.password"
            @focus="
              () => {
                registerStore.isFocus = true
                formElement?.clearValidate('password')
              }
            "
            show-password
          />
        </up-form-item>
        <template v-if="registerStore.isFocus && !registerStore.kdfPassword">
          <br />
          <up-form-item
            :label="registerStore.confirmPassword && $t('ConfirmPassword')"
            prop="confirmPassword"
            :rules="[{ validator: checkConfirmPassword, trigger: 'blur' }]"
          >
            <up-input
              :placeholder="$t('PleaseConfirmPassword')"
              v-model="registerStore.confirmPassword"
              show-password
              @focus="formElement?.clearValidate('confirmPassword')"
            />
          </up-form-item>
          <up-button
            class="mold"
            type="primary"
            @click="moldPassword"
            :disabled="!(registerStore.confirmPassword && registerStore.password)"
          >
            {{ $t('Mold') }}
          </up-button>
        </template>
        <div class="mask" v-if="registerStore.kdfPassword">
          <img src="@/assets/img/register/mold-green.svg" />
          <div class="mold-success">{{ $t('CastingSuccess') }}</div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegister } from '@/composable/useRegister'
import { useEmailCode } from '@/composable/useCode'

const { unipass, registerStore, checkConfirmPassword, moldPassword, formElement, getToken } =
  useRegister()

const {
  form: formCode,
  formElement: formCodeElement,
  fetchEmailCode,
  verifyEmailCode: moldCode,
} = useEmailCode('signUp', registerStore.email, getToken)
</script>
