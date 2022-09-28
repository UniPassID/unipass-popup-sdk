<template>
  <el-button v-bind="$attrs" class="up-button">
    <template v-for="(index, name) in $slots" #[name]><slot :name="name" /></template>
  </el-button>
</template>
