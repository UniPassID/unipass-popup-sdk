<template>
  <div class="up-token" :class="type">
    <div class="token-box">
      <up-icon class="box-token" :name="props.name" />
      <up-icon class="box-chain" :name="chain" />
    </div>
    <div class="index" v-if="props.type === 'index'">
      <div class="index-title">{{ props.name }}</div>
      <div class="index-subtitle">{{ props.subtitle || subtitleDefault }}</div>
    </div>
    <div class="overage" v-else-if="props.balance !== undefined">
      <div class="token-name">{{ props.name }}</div>
      <div class="token-overage">
        {{ $t('Balance') }}：{{ Number(Number(props.balance).toFixed(6)) }}
      </div>
    </div>
    <div class="name" v-else>{{ props.name }}</div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  name: string
  chain: string
  balance?: number | string
  type?: string
  subtitle?: string
}

const chain = computed(() => {
  return {
    polygon: 'Polygon',
    bsc: 'BSC',
    rangers: 'Rangers',
  }[props.chain]
})

const props = withDefaults(defineProps<Props>(), {
  name: '',
  chain: '',
  balance: undefined,
})

const subtitleDefault = computed(() => {
  const dict = {
    MATIC: 'MATIC',
    WETH: 'Ethereum',
    USDT: 'Tether',
    USDC: 'USD Coin',
  }
  return dict[props.name] || props.name
})
</script>

<style lang="scss">
.up-token {
  display: flex;
  align-items: center;
  .token-box {
    position: relative;
    height: 32px;
    width: 32px;
    .box-token {
      font-size: 32px;
    }
    .box-chain {
      border-radius: 50%;
      position: absolute;
      right: -8px;
      bottom: 0;
      font-size: 16px;
      border: 1px solid #ffffff;
    }
  }
  .name {
    margin-left: 20px;
    font-size: 14px;
    font-weight: 400;
    color: var(--up-text-third);
    line-height: 14px;
  }
  .overage {
    margin-left: 20px;
    .token-name {
      font-size: 16px;
      font-weight: 600;
      color: var(--up-text-primary);
      line-height: 16px;
    }
    .token-overage {
      margin-top: 6px;
      font-size: 12px;
      font-weight: 400;
      color: var(--up-text-third);
      line-height: 12px;
    }
  }
}
.up-token.index {
  .token-box {
    height: 40px;
    width: 40px;
    .box-token {
      font-size: 40px;
    }
    .box-chain {
      font-size: 20px;
      right: -6px;
    }
  }
  .index {
    text-align: left;
    margin-left: 18px;
    .index-title {
      font-size: 16px;
      font-weight: 600;
      line-height: 16px;
    }
    .index-subtitle {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 400;
      color: var(--up-text-third);
      line-height: 14px;
    }
  }
}
</style>
