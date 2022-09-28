<template>
  <el-form-item v-bind="$attrs" class="up-form-item">
    <template v-for="(index, name) in $slots" #[name]><slot :name="name" /></template>
    <template #error="{ error }">
      <div class="error"><up-icon name="wrong" />{{ error }}</div>
    </template>
  </el-form-item>
</template>
