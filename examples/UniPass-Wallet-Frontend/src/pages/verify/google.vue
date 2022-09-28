<template>
  <div id="page-verify-google">
    <up-header :title="$t('GoogleVerify')" :back="back" />
    <template v-if="step === 1">
      <img class="up-illustration" src="@/assets/img/verify/google.png" />
      <h6>{{ $t('VerifyGoogleTitle1') }}</h6>
      <div class="up-setting">
        <div class="one">
          <span>{{ $t('VerifyGoogleTip') }}</span>
          <up-icon name="jump" />
        </div>
      </div>
      <up-button class="submit" type="primary" @click="step = 2">{{ $t('ToBind') }}</up-button>
    </template>
    <template v-else>
      <div class="qrcode">
        <img v-if="form.secertQRCode" :src="form.secertQRCode" class="qr-code" />
      </div>
      <div class="secert-box">
        <div class="secert" @click="unipass.copy(form.secert)">
          <span>{{ form.secert }}</span>
          <up-icon name="copy" />
        </div>
      </div>
      <h6>{{ $t('VerifyGoogleTitle2') }}</h6>
      <up-input
        class="google-code"
        v-model="form.code"
        :disabled="form.loading"
        :placeholder="$t('EnterGoogleCode')"
      ></up-input>
      <up-button
        class="submit"
        type="primary"
        :disabled="!form.code"
        :loading="form.loading"
        @click="bindGoogle"
      >
        {{ $t('Confirm') }}
      </up-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useVerifyGoogle } from '@/composable/useVerify'
import { useUniPass } from '@/utils/useUniPass'

const unipass = useUniPass()

const { bindGoogle, back, step, form } = useVerifyGoogle()
</script>

<style lang="scss">
#page-verify-google {
  .qrcode {
    margin: 40px auto 20px;
    width: 120px;
    height: 120px;
    background: #ffffff;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    .qr-code {
      width: 105px;
      height: 105px;
    }
  }
  .secert-box {
    display: flex;
    justify-content: center;
    .secert {
      cursor: pointer;
      padding: 13px 16px;
      background: var(--up-bg);
      border-radius: 8px;

      font-size: 14px;
      font-weight: 400;
      line-height: 14px;
      .iconpark {
        margin-left: 35px;
      }
    }
  }
  .google-code {
    margin-top: 40px;
  }
  .submit {
    margin-top: 40px;
  }
}
</style>
