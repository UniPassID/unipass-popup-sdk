<template>
  <div id="page-login">
    <up-header hide-back />
    <img class="illustration" src="@/assets/img/register/illustration.png" title="UniPass Wallet" />
    <h2>{{ $t('LoginTitle') }}</h2>
    <h4>{{ $t('LoginSubtitle') }}</h4>
    <el-form @submit.prevent ref="formElement" label-position="top" :model="loginStore">
      <up-form-item
        :label="loginStore.email && $t('Email')"
        prop="email"
        :rules="[{ validator: unipass.checkEmailFormat, trigger: 'blur' }]"
      >
        <up-input
          :placeholder="$t('EmailEmpty')"
          @input="(v) => (loginStore.email = unipass.formatEmail(v))"
          @focus="formElement?.clearValidate('email')"
          v-model="loginStore.email"
          clearable
          @keydown.enter="loginStore.email && loginStore.password && submit()"
        />
      </up-form-item>
      <up-form-item prop="password" :label="loginStore.password && $t('Password')">
        <up-input
          :placeholder="$t('PasswordEmpty')"
          @input="(v) => (loginStore.password = unipass.formatPassword(v))"
          v-model="loginStore.password"
          @keydown.enter="loginStore.email && loginStore.password && submit()"
          @focus="formElement?.clearValidate('password')"
          show-password
        />
      </up-form-item>
      <div class="forgot-password">
        <a @click="forgotPassword">{{ $t('ForgotPassword') }}</a>
      </div>
    </el-form>
    <up-button
      class="next"
      type="primary"
      :loading="loginStore.loading"
      :disabled="!(loginStore.email && loginStore.password)"
      @click="submit"
    >
      {{ $t('NextStep') }}
    </up-button>
    <router-link to="/register" class="have-account">
      <span>{{ $t('NoAccount') }}</span
      >&ensp;<strong>{{ $t('ToSignUp') }}</strong>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { useLogin } from '@/composable/useLogin'
import { useUniPass } from '@/utils/useUniPass'

const { loginStore, formElement, submit } = useLogin()
const unipass = useUniPass()
const router = useRouter()
const { t: $t } = useI18n()

const forgotPassword = () => {
  router.push('/recovery')
}
</script>

<style lang="scss">
#page-login {
  img.illustration {
    pointer-events: none;
    margin-top: 20px;
    width: 200px;
    height: 200px;
  }
  .el-form {
    margin-top: 40px;
    .el-form-item + .el-form-item {
      margin-top: 24px;
    }
  }
  .forgot-password {
    margin-top: 10px;
    text-align: right;
    a {
      color: var(--up-text-secondary);
    }
    a:hover {
      color: var(--up-text-third);
    }
  }
  .next {
    margin-top: 40px;
  }
  a.have-account {
    display: block;
    margin-top: 20px;
    color: initial;
    span {
      color: var(--up-text-secondary);
    }
  }
}
</style>
