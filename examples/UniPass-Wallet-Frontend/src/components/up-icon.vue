<!-- https://bytedance.feishu.cn/wiki/wikcnJZV45hM71QgI60iwkzvXob#bIprMt -->
<template>
  <iconpark-icon
    :icon-id="props.name"
    :width="width"
    :height="height"
    class="iconpark"
    :class="`icon-${props.name}`"
  ></iconpark-icon>
</template>

<script setup lang="ts">
interface Props {
  name: string
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  width: '',
  height: '',
})
</script>
