<template>
  <div id="page">
    <PageIndex v-if="userStore.address" />
    <PageLogin v-else />
  </div>
</template>

<script setup lang="ts">
import PageLogin from "./components/page-login.vue";
import PageIndex from "./components/page-index.vue";
import { useUserStore } from "./stores/user";

const userStore = useUserStore();
</script>
