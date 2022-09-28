<template>
  <up-dialog v-model="userStore.showSupportEmail" custom-class="dialog-support-email">
    <div class="title">{{ $t('SupportMailTitle') }}</div>
    <div class="support">
      <div class="tip">{{ $t('SupportMail') }}</div>
      <div class="mail">
        <img class="logo" src="@/assets/img/support-email/google.svg" />
        <div>gmail.com</div>
        <span>/</span>
        <div>googlemail.com</div>
      </div>
      <div class="mail">
        <img class="logo" src="@/assets/img/support-email/outlook.svg" />
        <div>outlook.com</div>
        <span>/</span>
        <div>hotmail.com</div>
      </div>
      <div class="mail">
        <img class="logo" src="@/assets/img/support-email/yahoo.svg" />
        <div>yahoo.com</div>
      </div>
      <div class="mail">
        <img class="logo" src="@/assets/img/support-email/protonmail.svg" />
        <div>protonmail.com</div>
        <span>/</span>
        <div>proton.me</div>
        <span>/</span>
        <div>pm.me</div>
      </div>
      <div class="mail">
        <img class="logo" src="@/assets/img/support-email/icloud.svg" />
        <div>icloud.com</div>
      </div>
      <div class="mail">
        <img class="logo" src="@/assets/img/support-email/mail.svg" />
        <div>mail.com</div>
      </div>
    </div>
    <div class="content">
      {{ $t('UniPassDKIM') }}
    </div>
    <up-button type="primary" @click="userStore.showSupportEmail = false">
      {{ $t('Understood') }}
    </up-button>
  </up-dialog>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
</script>
<style lang="scss">
.el-dialog.dialog-support-email {
  .el-dialog__body {
    color: var(--up-text-primary);
    .title {
      font-size: 16px;
      font-weight: 600;
      line-height: 26px;
    }
    .support {
      border-top: 1px dashed var(--up-line);
      border-bottom: 1px dashed var(--up-line);
      padding: 20px 0;
      margin: 20px 0;
      .tip {
        font-size: 12px;
        font-weight: 400;
        color: var(--up-text-secondary);
        line-height: 12px;
        margin-bottom: 16px;
      }
      .mail {
        display: flex;
        align-items: center;
        .logo {
          margin-right: 12px;
        }
      }
      .mail + .mail {
        margin-top: 28px;
      }
    }
    .content {
      margin-bottom: 20px;
      font-size: 12px;
      font-weight: 400;
      color: var(--up-text-third);
      line-height: 20px;
    }
  }
}
</style>
