<template>
  <div class="up-header-connect">
    <div class="header">
      <div class="user">
        <div class="left">
          <img src="@/assets/img/index/avatar.svg" />
        </div>
        <div class="right">
          <div class="email">{{ userStore.user.email }}</div>
          <div class="address" @click="unipass.copy(userStore.user.account)">
            <span>{{ unipass.formatAddress(userStore.user.account) }}</span>
            <up-icon name="copy" />
          </div>
        </div>
      </div>
      <div class="wallet">
        <up-icon name="wallet" />
        <span>$163.35</span>
      </div>
    </div>
    <el-select
      v-if="!props.hideChain"
      v-model="chain.label"
      class="page-connect-chain"
      popper-class="page-connect-chain-select"
      @change="chainChange"
      :suffix-icon="suffixIcon"
    >
      <template #prefix>
        <img :src="require(`@/assets/img/setting/chain/${chain.label}.svg`)" />
        <div class="label">{{ chain.label }}</div>
        <div class="value">${{ chain.value }}</div>
      </template>
      <el-option v-for="e in chainList" :key="e.label" :label="e.label" :value="e.label">
        <img :src="require(`@/assets/img/setting/chain/${e.label}.svg`)" />
        <div class="label">{{ e.label }}</div>
        <div class="value">${{ e.value }}</div>
      </el-option>
    </el-select>
    <div class="more-box" v-show="showMore">
      <up-button type="primary" class="enter" @click="$router.push('/')">
        {{ $t('EnterWallet') }}
      </up-button>
      <up-button type="info" class="setting" @click="$router.push('/setting')">
        <up-icon name="setting" />
      </up-button>
      <up-button type="info" class="exit" @click="unipass.userExit">
        <up-icon name="exit" />
      </up-button>
    </div>
    <up-icon
      class="more"
      :class="{ show: showMore }"
      :name="`expand-${isDark ? 'dark' : 'light'}`"
      @click="showMore = !showMore"
    />
  </div>
</template>

<script setup lang="ts">
import { useIndex } from '@/composable/useIndex'
import { useUniPass } from '@/utils/useUniPass'
import UpIcon from '@/components/up-icon.vue'

interface Props {
  hideChain?: boolean
}

const props = withDefaults(defineProps<Props>(), { hideChain: false })

const unipass = useUniPass()
const suffixIcon = h(UpIcon, { name: 'select' })

const { userStore } = useIndex()
const isDark = useDark()
const showMore = ref(false)

const chain = reactive({
  label: 'Polygon',
  value: '163.35',
})
const chainList = [
  {
    value: '163.35',
    label: 'Polygon',
  },
  {
    value: '0',
    label: 'BSC',
  },
  {
    value: '0',
    label: 'ETH',
  },
]
const chainChange = (label: string) => {
  const item = chainList.find((e) => e.label === label)
  if (item) {
    chain.label = item.label
    chain.value = item.value
  }
}
</script>

<style lang="scss">
.page-connect-chain,
.page-connect-chain-select {
  .el-input__prefix-inner > div,
  .el-select-dropdown__item {
    display: flex;
    align-items: center;

    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
    color: var(--up-text-primary);
    img {
      width: 24px;
      height: 24px;
    }

    .label {
      margin-left: 10px;
    }
    .value {
      margin-left: 10px;

      font-weight: 400;
      color: var(--up-text-secondary);
    }
  }
}
.page-connect-chain {
  margin-top: 21px;
  .el-input__wrapper {
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    background: var(--up-bg);
    box-shadow: inset 1px 1px 3px 0px var(--up-line);
    border-radius: 12px;
    backdrop-filter: blur(8px);
    .el-input__inner {
      display: none;
    }
    .el-input__suffix {
      .icon-select {
        font-size: 15px;
      }
    }
  }
}
.page-connect-chain-select {
  padding: 2px 6px;

  .el-popper__arrow {
    display: none;
  }
  .el-select-dropdown__item {
    padding: 12px 10px;
    height: auto;
    &.hover {
      background: var(--up-bg);
      border-radius: 12px;
    }
  }
}

.up-header-connect {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    .user {
      text-align: left;
      display: flex;
      .left {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        background: #000000;
        border: 1px solid #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
      }
      .right {
        .email {
          font-size: 16px;
          font-weight: 600;
          line-height: 16px;
        }
        .address {
          cursor: pointer;
          margin-top: 8px;
          font-size: 14px;
          line-height: 14px;
          font-weight: 400;
          color: var(--up-text-third);
          .icon-copy {
            margin-left: 6px;
          }
        }
      }
    }
    .wallet {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      line-height: 16px;

      .icon-wallet {
        margin-right: 6px;
        font-size: 20px;
      }
    }
  }
  .more-box {
    margin-top: 24px;
    display: flex;
    align-items: center;
    .up-button {
      height: 40px;

      &.setting,
      &.exit {
        border-radius: 16px;
        width: 40px;
        margin-left: 20px;
      }
    }
  }
  .more {
    cursor: pointer;
    margin-top: 12px;
    font-size: 20px;
    transition: transform var(--el-transition-duration);
    &.show {
      transform: rotateZ(180deg);
    }
  }
}
</style>
