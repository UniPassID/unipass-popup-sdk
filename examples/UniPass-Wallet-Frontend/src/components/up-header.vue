<template>
  <div class="up-header">
    <div class="left">
      <up-icon v-if="props.hideBack" name="UniPass" width="120px" height="24px"></up-icon>
      <up-icon v-else name="back" @click="goBack"></up-icon>
      <div v-if="props.title" class="title">{{ props.title }}</div>
    </div>
    <div class="right">
      <up-icon
        v-if="!props.title"
        name="more"
        @click="userStore.showHeaderMore = !userStore.showHeaderMore"
      ></up-icon>
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

interface Props {
  hideBack?: boolean
  back?: () => void
  title?: string
}

const props = withDefaults(defineProps<Props>(), { hideBack: false })

const router = useRouter()

const goBack = () => {
  if (props.back) {
    props.back()
  } else {
    router.back()
  }
}
</script>

<style lang="scss">
.up-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // height: 50px;
  > .left {
    display: flex;
    align-items: center;
    > .icon-back {
      cursor: pointer;
      font-size: 24px;
    }
    > .title {
      margin-left: 12px;
      font-size: 20px;
      font-weight: 600;
      line-height: 20px;
    }
  }
  > .right {
    display: flex;
    align-items: center;
    > .icon-more {
      cursor: pointer;
      font-size: 24px;
    }
  }
}
</style>
