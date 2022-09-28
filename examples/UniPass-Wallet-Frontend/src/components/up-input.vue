<template>
  <el-input v-bind="$attrs" ref="element" class="up-input">
    <template v-for="(index, name) in $slots" #[name]><slot :name="name" /></template>
    <template #prefix>
      <div class="left"></div>
      <div class="center"></div>
      <div class="right"></div>
      <div class="bottom"></div>
    </template>
  </el-input>
</template>

<script setup lang="ts">
const element = ref()

defineExpose({
  element,
})
</script>
