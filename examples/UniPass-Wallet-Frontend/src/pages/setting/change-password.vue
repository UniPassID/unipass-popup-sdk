<template>
  <div id="page-setting-change-password">
    <up-header :title="$t('ChangePassword')" />
    <h4>{{ $t('ChangePasswordTitle') }}</h4>
    <up-input v-model="form.oldPassword" :placeholder="$t('EnterOldPassword')" show-password />
    <up-input v-model="form.password" :placeholder="$t('EnterNewPassword')" show-password />
    <up-input
      v-model="form.confirmPassword"
      :placeholder="$t('ConfirmNewPassword')"
      show-password
    />
    <up-button
      class="submit"
      type="primary"
      :disabled="!(form.oldPassword && form.password && form.confirmPassword)"
      @click="submit"
    >
      {{ $t('Submit') }}
    </up-button>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  oldPassword: '',
  password: '',
  confirmPassword: '',
})
const submit = () => {
  console.log('// todo', 'change-password')
}
</script>

<style lang="scss">
#page-setting-change-password {
  h4 {
    margin-bottom: 28px;
  }
  .up-input + .up-input {
    margin-top: 24px;
  }
  .submit {
    margin-top: 40px;
  }
}
</style>
