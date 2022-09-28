<template>
  <div id="page-setting-2FA">
    <up-header :title="$t('DualAuthentication')" />
    <h4>{{ $t('ChangePasswordTitle') }}</h4>
    <div class="box">
      <div class="one bound" @click="$router.push('/setting/2FA/email')">
        <div class="img-box">
          <up-icon :name="`email-${isDark ? 'dark' : 'light'}`" class="img" />
          <up-icon name="success" />
        </div>
        <span>{{ $t('EmailVerify') }}</span>
      </div>
      <div class="one bound" @click="bindPhone">
        <div class="img-box">
          <up-icon :name="`phone-${isDark ? 'dark' : 'light'}`" class="img" />
          <up-icon v-if="phone.status === 1" name="success" />
        </div>
        <span>{{ $t('PhoneVerify') }}</span>
      </div>
      <div class="one" @click="bindGoogle">
        <div class="img-box">
          <up-icon :name="`google-${isDark ? 'dark' : 'light'}`" class="img" />
          <up-icon v-if="google.status === 1" name="success" />
        </div>
        <span>{{ $t('GoogleVerify') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { use2FAStore } from '@/store/2FA'

const isDark = useDark()

const { phone, google, init2FA, bindPhone, bindGoogle } = use2FAStore()

init2FA()
</script>

<style lang="scss">
#page-setting-2FA {
  .box {
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .one {
      cursor: pointer;
      margin-top: 18px;
      width: 48%;
      height: 138px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: initial;

      &:hover {
        background: var(--up-bg);
      }

      .img-box {
        position: relative;
        width: 40px;
        height: 40px;
        .img {
          font-size: 40px;
        }
        .icon-success {
          position: absolute;
          bottom: 0;
          right: -8px;
          color: var(--up-green);
        }
      }
      span {
        margin-top: 16px;
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;
      }
    }
  }
}
</style>
