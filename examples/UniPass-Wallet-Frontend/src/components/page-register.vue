<template>
  <div id="page-register">
    <up-header hide-back />
    <img class="illustration" src="@/assets/img/register/illustration.png" title="UniPass Wallet" />
    <h2>{{ $t('RegisterTitle') }}</h2>
    <h4>{{ $t('RegisterSubtitle') }}</h4>
    <el-form @submit.prevent ref="formElement" :model="registerStore">
      <up-form-item
        prop="email"
        :rules="[{ validator: unipass.checkEmailFormat, trigger: 'blur' }]"
        :label="registerStore.email && $t('Email')"
      >
        <up-input
          @input="(v: string) => (registerStore.email = unipass.formatEmail(v))"
          v-model="registerStore.email"
          @focus="formElement?.clearValidate('email')"
          @keydown.enter="registerStore.email && submit()"
          clearable
          :placeholder="$t('EmailEmpty')"
        />
      </up-form-item>
    </el-form>
    <up-button class="next" type="primary" @click="submit" :disabled="!registerStore.email">
      {{ $t('NextStep') }}
    </up-button>
    <router-link to="/login" class="have-account">
      <span>{{ $t('HaveAccount') }}</span
      >&ensp;<strong>{{ $t('ToLogin') }}</strong>
    </router-link>
    <up-dialog v-model="showWarning" top="279px" custom-class="dialog-warning">
      <div class="title">
        {{ $t('RegisterWarningTip1') }}<br />
        {{ $t('RegisterWarningTip2') }}
      </div>
      <!--
      <div class="content">
        {{ $t('RegisterWarningTip3') }}<br />
        {{ $t('RegisterWarningTip4') }}
      </div>
      -->
      <div class="btns">
        <up-button type="info" size="small" @click="showWarning = false">
          {{ $t('Cancel') }}
        </up-button>
        <up-button type="primary" size="small" @click="registerStore.step = 2">
          {{ $t('Confirm') }}
        </up-button>
      </div>
    </up-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useRegister } from '@/composable/useRegister'

const { unipass, showWarning, registerStore, submit, formElement } = useRegister()
</script>

<style lang="scss">
#page-register {
  .dialog-warning {
    .title {
      font-size: 16px;
      font-weight: 600;
      color: var(--up-text-primary);
      line-height: 26px;
    }
    .content {
      margin-top: 20px;
      font-size: 12px;
      font-weight: 400;
      color: var(--up-text-secondary);
      line-height: 20px;
    }
    .btns {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      .up-button {
        width: 114px;
        height: 36px;
      }
    }
  }

  img.illustration {
    pointer-events: none;
    margin-top: 53px;
    width: 260px;
    height: 260px;
  }
  .el-form {
    margin-top: 40px;
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
