<template>
  <div class="up-sign-card" :class="{ show: props.show }">
    <template v-if="props.type === 'send-token'">
      <div class="title" @click="$emit('update:show', !props.show)">
        <span>{{ $t('SendToken') }}</span>
        <up-icon name="select" />
      </div>
      <div v-if="showError" class="error">
        <up-icon name="warning" />
        <span>{{ $t('SendTokenError') }}</span>
      </div>
      <template v-if="props.show">
        <div class="main">
          <up-token :name="data.symbol" :chain="data.chain" />
          <div class="amount">
            <div class="token">{{ data.amount }} {{ data.symbol }}</div>
            <div class="dollar">~$119.88</div>
          </div>
        </div>
        <div class="contract-box">
          <div class="address-box">
            <div>{{ $t('SendTo') }}</div>
            <div class="address">{{ unipass.formatAddress(data.address) }}</div>
          </div>
        </div>
        <div class="raw-data">
          <span>{{ $t('RawData') }}</span>
          <up-icon name="jump" />
        </div>
      </template>
    </template>
    <template v-else-if="props.type === 'contract-call'">
      <div class="title" @click="$emit('update:show', !props.show)">
        <span>{{ $t('ContractCall') }}</span>
        <up-icon name="select" />
      </div>
      <template v-if="props.show">
        <div class="contract-box">
          <div class="address-box">
            <div>{{ $t('ContractAddress') }}</div>
            <div class="address">0xs9283...28373</div>
          </div>
          <div class="one">
            <div>Protocol</div>
            <div>Unknown Protocol</div>
          </div>
          <div class="one">
            <div>Action</div>
            <div>Multicall</div>
          </div>
        </div>
        <div class="raw-data">
          <span>{{ $t('RawData') }}</span>
          <up-icon name="jump" />
        </div>
      </template>
    </template>
    <template v-else>
      <div class="title" @click="$emit('update:show', !props.show)">
        <span>{{ $t('TokenApproval') }}</span>
        <up-icon name="select" />
      </div>
      <template v-if="props.show">
        <div class="main">
          <up-token name="Polygon" />
          <div class="amount">
            <div class="token">29 ETH</div>
            <div class="dollar">~$134.20</div>
          </div>
        </div>
        <div class="contract-box">
          <div class="address-box">
            <div>{{ $t('ApprovalTo') }}</div>
            <div class="address">0xs9283...28373</div>
          </div>
        </div>
        <div class="raw-data">
          <span>{{ $t('RawData') }}</span>
          <up-icon name="jump" />
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { TransactionType, useUniPass } from '@/utils/useUniPass'
interface Props {
  show: boolean
  type: TransactionType
  data: any
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  type: 'send-token',
  data: {},
})

interface Emits {
  (event: 'update:show'): void
}

const $emit = defineEmits<Emits>()
const unipass = useUniPass()
const userStore = useUserStore()

const showError = computed(() => {
  if (props.type === 'send-token') {
    const coin = userStore.coins.find((e) => e.symbol === props.data.symbol)
    if (coin) {
      if (Number(props.data.amount) > Number(coin.balance)) {
        return true
      }
    }
  }
  return false
})
</script>

<style lang="scss">
.up-sign-card {
  margin-top: 20px;
  background: var(--up-bg);
  border-radius: 12px;
  padding: 20px;

  &.show {
    .title {
      .icon-select {
        transform: rotateZ(0deg);
      }
    }
  }
  .title {
    cursor: pointer;
    user-select: none;

    display: flex;
    align-items: center;
    justify-content: space-between;

    font-size: 20px;
    font-weight: 600;
    line-height: 20px;

    .icon-select {
      transition: transform var(--el-transition-duration);
      transform: rotateZ(-90deg);
    }
  }
  // gas-fee
  .top {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    color: var(--up-text-third);
    .title {
      color: initial;
    }
    .question {
      cursor: pointer;
      padding: 0 6px;
      font-size: 16px;
    }
    .jump {
      cursor: pointer;
      margin-left: auto;
      display: flex;
      align-items: center;
      .icon-jump {
        margin-left: 4px;
      }
    }
  }
  .gas-fee {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    .el-radio {
      display: flex;
      width: 100%;
      height: auto;
      padding: 17px 10px;

      border-radius: 12px;
      margin-right: 0;
      .el-radio__label {
        padding: 0;
        display: flex;
        align-items: center;
        width: 100%;

        .fee-box {
          margin-left: auto;
          text-align: right;
          margin-right: 12px;
          .fee {
            font-size: 16px;
            font-weight: 600;
            line-height: 16px;
            color: var(--up-text-primary);
          }
          .fee-dollar {
            margin-top: 6px;
            font-size: 12px;
            font-weight: 400;
            color: var(--up-text-third);
            line-height: 12px;
          }
        }
      }
      .check {
        border-radius: 50%;
        width: 14px;
        height: 14px;
        border: 1px solid var(--up-line);
        display: flex;
        justify-content: center;
        align-items: center;
        .dot {
          border-radius: 50px;
          width: 8px;
          height: 8px;
        }
      }

      &.is-checked {
        .check {
          border-color: #8864ff;

          .dot {
            background: #8864ff;
          }
        }
      }

      &.is-disabled {
        cursor: no-drop;
        .check {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid #606060;
        }
        .el-radio__label {
          .fee-box {
            .fee {
              color: var(--up-text);
            }
            .fee-dollar {
              color: #ad94ff;
            }
          }
        }
      }
      .el-radio__input {
        display: none;
      }
      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }
  }
  .error {
    margin-top: 20px;
    display: flex;
    align-items: center;
    padding: 14px 16px;
    background: var(--up-pink);
    border-radius: 12px;
    border: 1px solid var(--up-red);
    color: var(--up-red);
    .iconpark {
      margin-right: 6px;
    }
  }

  .main {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    .amount {
      text-align: right;
      .token {
        font-size: 20px;
        font-weight: bold;
        line-height: 20px;
      }
      .dollar {
        margin-top: 10px;
        font-size: 14px;
        font-weight: 400;
        color: var(--up-text-third);
        line-height: 14px;
      }
    }
  }
  .contract-box {
    margin-top: 20px;
    padding: 16px;
    background: var(--up-bg);
    border-radius: 12px;
    .address-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      .address {
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;
      }
    }
    .one {
      margin-top: 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      color: var(--up-text);
      line-height: 14px;
    }
  }
  .raw-data {
    cursor: pointer;
    user-select: none;
    margin-top: 20px;

    display: flex;
    align-items: center;
    justify-content: flex-end;

    height: 14px;
    font-size: 14px;
    font-weight: 400;
    color: var(--up-text-third);
    line-height: 14px;
  }
}
</style>
