<template>
  <div class="up-sign">
    <slot name="main">
      <div class="t1">{{ $t('SignTransaction') }}</div>
      <div class="chain-box">
        <div class="chain" :class="chainName">On {{ chainName }}</div>
        <div class="dot"></div>
        <span>{{ $t('NoRisk') }}</span>
      </div>
      <up-sign-card
        v-for="(card, i) in signStore.cards"
        v-model:show="card.show"
        :type="card.type"
        :data="card.data"
        :key="i"
      />
      <div class="up-sign-card">
        <div class="top">
          <div class="title">{{ $t('GasFee') }}</div>
          <up-icon class="question" :name="isDark ? 'question-dark' : 'question-light'" />
          <div class="jump">
            <div>{{ $t('NormalSpeed') }}</div>
            <up-icon name="jump" />
          </div>
        </div>
        <el-radio-group class="gas-fee" v-model="signStore.feeSymbol">
          <el-radio
            v-for="coin in userStore.coins.filter((e) => e.chain === signStore.coin.chain)"
            :key="coin.symbol"
            :label="coin.symbol"
            :disabled="Number(coin.gasFee) > Number(coin.balance) || signStore.loading"
          >
            <up-token :name="coin.symbol" :chain="coin.chain" :balance="coin.balance" />
            <div class="fee-box">
              <div class="fee">{{ coin.gasFee }} {{ coin.symbol }}</div>
              <div class="fee-dollar">~$134,20</div>
            </div>
            <div class="check">
              <div class="dot"></div>
            </div>
          </el-radio>
        </el-radio-group>
      </div>
    </slot>
    <slot name="footer">
      <div class="btns">
        <up-button type="info" @click="$emit('cancel')" :disabled="signStore.loading">
          {{ $t('Cancel') }}
        </up-button>
        <up-button
          type="primary"
          @click="sign"
          :loading="signStore.loading"
          :disabled="!signStore.feeSymbol"
        >
          {{ $t('Sign') }}
        </up-button>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { useSign } from '@/composable/useSign'
const { userStore, isDark, signStore, sign } = useSign()
const chainName = computed(() => {
  const dict = {
    bsc: 'BSC',
    polygon: 'Polygon',
    rangers: 'Rangers',
  }
  return dict[signStore.coin.chain] || ''
})
</script>

<style lang="scss">
.up-sign {
  .t1 {
    margin-top: 28px;
    font-size: 28px;
    font-weight: bold;
    line-height: 28px;
  }
  .t2 {
    margin-top: 20px;
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
  }
  .label {
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 400;
    color: var(--up-text-third);
    line-height: 14px;
  }
  .user {
    margin-bottom: 28px;
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
      }
    }
  }
  .from {
    margin-bottom: 28px;
    display: flex;
    align-items: center;

    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    img {
      margin-right: 10px;
      width: 24px;
      height: 24px;
    }
  }
}
.up-sign.transaction {
  .chain-box {
    margin-top: 18px;
    display: flex;
    align-items: center;
    .chain {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 96px;
      height: 24px;
      background: #8247e5;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      line-height: 14px;

      &.Polygon {
        background: #8247e5;
      }
      &.BSC {
        background: #ecb42b;
      }
      &.Rangers {
        background: #3498db;
      }
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #4aac4c;
      margin-left: 12px;
      margin-right: 6px;
    }
  }
}
</style>
