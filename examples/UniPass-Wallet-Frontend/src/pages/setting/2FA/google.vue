<template>
  <div id="page-setting-2FA-google">
    <up-header :title="$t('GoogleVerify')" />
    <img class="up-illustration" src="@/assets/img/setting/verify/google.png" />
    <h6>{{ $t('GoogleVerifyTitle') }}</h6>
    <div class="up-setting">
      <div class="one">
        <span>{{ $t('OpenGoogleVerify') }}</span>
        <el-switch
          v-model="form.open"
          :loading="form.loading"
          :before-change="beforeChange"
          style="--el-switch-on-color: var(--up-green)"
        />
      </div>
      <div class="one jump" v-if="form.open" @click="$router.push('/verify/google')">
        <span>{{ $t('ChangeGoogleVerify') }}</span>
        <up-icon name="jump" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { use2faGoogle } from '@/composable/use2FA'
const { form, beforeChange } = use2faGoogle()
</script>
