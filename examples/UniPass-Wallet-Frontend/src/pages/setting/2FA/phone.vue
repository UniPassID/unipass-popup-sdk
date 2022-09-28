<template>
  <div id="page-setting-2FA-phone">
    <up-header :title="$t('PhoneVerify')" />
    <img class="up-illustration" src="@/assets/img/setting/verify/phone.png" />
    <h6>{{ $t('Setting2faPhoneTitle') }}</h6>
    <div class="up-setting">
      <div class="one">
        <span>{{ $t('OpenPhoneVerify') }}</span>
        <el-switch
          v-model="form.open"
          :loading="form.loading"
          :before-change="beforeChange"
          style="--el-switch-on-color: var(--up-green)"
        />
      </div>
      <div class="one jump" v-if="form.open" @click="$router.push('/verify/phone')">
        <span>{{ $t('ChangePhoneVerify') }}</span>
        <up-icon name="jump" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { use2faPhone } from '@/composable/use2FA'
const { form, beforeChange } = use2faPhone()
</script>
