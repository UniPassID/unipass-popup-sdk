<template>
  <div id="page-setting-2FA-email">
    <up-header :title="$t('EmailVerify')" />
    <img class="up-illustration" src="@/assets/img/setting/verify/email.png" />
    <h6>{{ $t('EmailVerifyTitle') }}</h6>
    <div class="up-setting">
      <div class="one">
        <span>{{ $t('OpenEmailVerify') }}</span>
        <el-switch
          :model-value="form.open"
          style="--el-switch-on-color: var(--up-green)"
          disabled
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  open: true,
})
</script>
