<template>
  <div id="page-recovery-loading">
    <up-header />
    <template v-if="isPending">
      <h2>{{ $t('RecoveringTitle') }}</h2>
      <div class="address-box">
        <div class="address">{{ unipass.formatAddress(address) }}</div>
      </div>
      <h4>{{ $t('RecoveringSubtitle') }}</h4>
      <div class="countdown">{{ countdown }}</div>
      <div class="subtitle">{{ $t('RecoveringTip') }}</div>
    </template>
    <template v-else>
      <h2>{{ $t('RecoveringNotPending') }}</h2>
      <div class="address-box">
        <div class="address">{{ unipass.formatAddress(address) }}</div>
      </div>
      <img class="success" src="@/assets/img/recovery/success.png" />
      <div class="tip">{{ $t('PleaseLoginNewPassword') }}</div>
    </template>
    <router-link to="/login">
      <up-button type="primary" class="submit">{{ $t('Confirm') }}</up-button>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { useRecovering } from '@/composable/useRecovering'
import { useUniPass } from '@/utils/useUniPass'

const unipass = useUniPass()
const { address, countdown, isPending } = useRecovering()
</script>

<style lang="scss">
#page-recovery-loading {
  .address-box {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    .address {
      padding: 9px 16px;
      background: var(--up-bg);
      border-radius: 12px;
      backdrop-filter: blur(8px);
      font-size: 14px;
      font-weight: 400;
      color: var(--up-text-third);
    }
  }
  .countdown {
    margin-top: 40px;
    padding: 24px 57px;
    background: var(--up-bg);
    border-radius: 12px;
    backdrop-filter: blur(8px);

    font-size: 32px;
    font-weight: 600;
  }
  .subtitle {
    margin-top: 20px;
    font-size: 14px;
    font-weight: 400;
    color: var(--up-text-third);
  }
  .submit {
    margin-top: 24vh;
  }

  img.success {
    margin-top: 60px;
    width: 100px;
    height: 100px;
  }
  .tip {
    margin-top: 24px;
    font-size: 16px;
    font-weight: 400;
    color: var(--up-text-secondary);
  }
}
</style>
