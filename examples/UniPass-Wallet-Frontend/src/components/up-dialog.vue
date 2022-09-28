<template>
  <el-dialog v-bind="$attrs" center :show-close="false" top="113px">
    <template v-for="(index, name) in $slots" #[name]><slot :name="name" /></template>
  </el-dialog>
</template>
