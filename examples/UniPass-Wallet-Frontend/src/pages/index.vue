<template>
  <div id="page-index">
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
      <router-link class="setting" to="/setting">
        <up-icon name="setting" />
      </router-link>
    </div>
    <div class="lump-sum-box">
      <div class="title">{{ $t('TotalAmount') }}</div>
      <div class="lump-sum">
        <div>${{ showLumpSum ? '60,990.00' : '*****' }}</div>
        <up-icon
          @click="showLumpSum = !showLumpSum"
          :name="showLumpSum ? 'eyes-open' : 'eyes-close'"
        />
      </div>
      <div class="gain">
        <up-icon name="rise" />
        <span>+5.64 (1%)</span>
      </div>
    </div>
    <div class="shortcut">
      <div class="btn-box">
        <div class="btn">
          <up-icon :name="`send-${isDark ? 'dark' : 'light'}`" />
        </div>
        <div>{{ $t('Send') }}</div>
      </div>
      <div class="btn-box active" @click="showReceive = true">
        <div class="btn">
          <up-icon name="receive-dark" />
        </div>
        <div>{{ $t('Receive') }}</div>
      </div>
      <div class="btn-box">
        <div class="btn">
          <up-icon :name="`swap-${isDark ? 'dark' : 'light'}`" />
        </div>
        <div>{{ $t('Swap') }}</div>
      </div>
    </div>

    <div class="recovering" v-if="recovering.isPending">
      <div class="progress">
        <router-link
          :to="{ path: '/recovery/loading', query: { address: userStore.user.account } }"
        >
          <el-progress
            :text-inside="true"
            :format="(percentage) => `${percentage}% Recovering...`"
            :stroke-width="24"
            :percentage="recovering.percentage"
          >
          </el-progress>
        </router-link>
      </div>
      <el-button
        :loading="recovering.loading"
        round
        type="danger"
        size="small"
        @click="cancelRecovery"
      >
        {{ $t('Cancel') }}
      </el-button>
    </div>
    <div class="coin-box">
      <div class="coin-title">{{ $t('Token') }}</div>
      <div
        class="coin"
        v-for="(coin, i) in userStore.coins"
        :key="i"
        @click="coinActive = coinActive === i ? -1 : i"
      >
        <div class="top">
          <up-token :name="coin.symbol" :chain="coin.chain" type="index" />
          <div class="balance">
            <div>{{ coin.balance }}</div>
            <div class="dollar">~$51,120.00</div>
          </div>
        </div>
        <div class="bottom" v-if="coinActive === i">
          <up-button type="primary" @click="sendCoin(i)">{{ $t('Transfer') }}</up-button>
        </div>
      </div>
    </div>

    <el-drawer
      v-model="showReceive"
      :with-header="false"
      custom-class="drawer-receive"
      direction="btt"
      size="572px"
    >
      <template #default>
        <div class="title">
          <span>{{ $t('Receive') }}</span>
          <up-icon name="close" @click="showReceive = false" />
        </div>
        <div class="qrcode">
          <img v-if="addressQRCode" :src="addressQRCode" class="qr-code" />
        </div>
        <div class="address">{{ userStore.user.account }}</div>
        <a class="view" target="_blank" :href="`${explorer}/address/${userStore.user.account}`">
          {{ $t('ViewInExplorer') }}
        </a>
        <up-button class="copy" type="primary" @click="unipass.copy(userStore.user.account)">
          {{ $t('CopyAddress') }}
        </up-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { useIndex } from '@/composable/useIndex'
import { useUniPass } from '@/utils/useUniPass'

const explorer = process.env.VUE_APP_Explorer as string
const unipass = useUniPass()
const isDark = useDark()

const showLumpSum = ref(true)
const coinActive = ref(-1)

const {
  cancelRecovery,
  recovering,
  userStore,
  // info
  addressQRCode,
  showReceive,
  // methods
  sendCoin,
} = useIndex()
</script>

<style lang="scss">
#page-index {
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
    .setting {
      cursor: pointer;
      width: 40px;
      height: 40px;
      background: var(--up-bg);
      box-shadow: inset 1px 1px 3px 0px var(--up-line);
      border-radius: 16px;
      backdrop-filter: blur(8px);
      color: initial;

      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
    }
  }
  .lump-sum-box {
    margin-top: 40px;
    .title {
      font-size: 16px;
      font-weight: 400;
      color: var(--up-text-secondary);
      line-height: 16px;
    }
    .lump-sum {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px 0;
      font-size: 36px;
      font-weight: bold;
      line-height: 36px;

      .iconpark {
        cursor: pointer;
        margin-left: 16px;
        font-size: 18px;
        color: var(--up-text-third);
      }
    }
    .gain {
      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 16px;
      font-weight: 600;
      color: #acf080;
      line-height: 16px;

      .iconpark {
        font-size: 20px;
        margin-right: 6px;
      }
    }
  }
  .shortcut {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn-box {
      font-size: 16px;
      font-weight: 400;
      color: var(--up-text-secondary);
      line-height: 16px;
      & + .btn-box {
        margin-left: 40px;
      }
      .btn {
        width: 68px;
        height: 68px;
        background: var(--up-bg);
        box-shadow: inset 1px 1px 3px 0px var(--up-line);
        border-radius: 30px;
        margin-bottom: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        .iconpark {
          font-size: 30px;
        }
      }
      &.active {
        cursor: pointer;
        .btn {
          background: linear-gradient(320deg, #8864ff 0%, #9a7cff 100%);
          box-shadow: inset 1px 1px 4px 0px rgba(255, 255, 255, 0.5);
        }
      }
    }
  }

  .recovering {
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .progress {
      width: 100%;
      .el-progress-bar__outer {
        background-color: #97989d;
      }
    }
    .el-button {
      margin-left: 14px;
    }
  }
  .coin-box {
    .coin-title {
      margin-top: 24px;
      margin-bottom: 24px;
      text-align: left;
      font-size: 20px;
      font-weight: 600;
      line-height: 20px;
    }
    .coin {
      cursor: pointer;
      padding: 20px;
      background: var(--up-bg);
      border-radius: 12px;
      backdrop-filter: blur(8px);
      & + .coin {
        margin-top: 20px;
      }
      .top {
        display: flex;
        align-items: center;

        .balance {
          margin-left: auto;
          font-size: 16px;
          font-weight: 600;
          line-height: 16px;
          text-align: right;
          .dollar {
            margin-top: 10px;
            font-size: 14px;
            font-weight: 400;
            color: var(--up-text-third);
            line-height: 14px;
          }
        }
      }
      .bottom {
        margin-top: 20px;
      }
    }
  }

  .drawer-receive {
    .el-drawer__body {
      padding: 40px 24px;
      position: relative;
      display: flex;
      align-items: center;
      flex-direction: column;
      .title {
        font-size: 24px;
        font-weight: bold;
        line-height: 24px;
        .icon-close {
          cursor: pointer;
          position: absolute;
          top: 24px;
          right: 24px;
          font-size: 24px;
        }
      }
      .qrcode {
        margin-top: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
        height: 200px;
        background: #ffffff;
        border-radius: 20px;
        border: 5px solid #fafafc;
        padding: 20px;
      }
      .address {
        margin-top: 20px;

        background: var(--up-mask);
        border-radius: 12px;
        padding: 10px 20px;

        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        line-height: 26px;
      }
      a.view {
        margin-top: 16px;
        text-decoration: underline;
        font-size: 14px;
        font-weight: 400;
        color: #acf080;
        line-height: 14px;
      }
      .copy {
        margin-top: 40px;
      }
    }
  }
}
</style>
