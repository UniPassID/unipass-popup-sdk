<template>
  <div id="page-send-success">
    <up-header></up-header>
    <el-result v-if="icon" :icon="icon" :title="title">
      <template #extra>
        <a class="explorer" :href="`${explorer}/tx/${$route.query.hash}`" target="_blank">
          {{ $t('ViewInExplorer') }}
        </a>
        <br />
        <br />
        <router-link to="/">
          <el-button type="primary">{{ $t('BackToHome') }}</el-button>
        </router-link>
      </template>
    </el-result>
    <template v-else>
      <br />
      <el-button loading size="large" link></el-button>
      <div>{{ $t('isTrading') }}</div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useSendLoading } from '@/composable/useSend'

const { icon, title, explorer } = useSendLoading()
</script>
<style lang="scss">
#page-send-success {
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      margin-top: 48px;
      font-size: 24px;
      font-weight: 600;
    }
    img.success {
      margin-top: 28px;
      width: 95px;
      height: 95px;
    }
    a.explorer {
      margin-top: 60px;
      font-size: 16px;
      font-weight: 400;
      color: #0364ff;
      text-decoration: underline;
    }
    .el-button {
      margin-top: 24px;
    }
  }
}
</style>
