<template>
  <div id="page-setting-chain">
    <up-header :title="$t('Network')" />
    <el-radio-group v-model="chain">
      <el-radio label="ETH">
        <div class="top">
          <img src="@/assets/img/setting/chain/ETH.svg" />
          <span>ETH</span>
          <div class="check">
            <div class="dot"></div>
          </div>
        </div>
        <div class="bottom">
          <span>{{ $t('AccountStatus') }}</span>
          <div class="status" style="background: #8864ff">{{ $t('Newest') }}</div>
        </div>
      </el-radio>
      <el-radio label="BSC">
        <div class="top">
          <img src="@/assets/img/setting/chain/BSC.svg" />
          <span>BSC</span>
          <div class="check">
            <div class="dot"></div>
          </div>
        </div>
        <div class="bottom">
          <span>{{ $t('AccountStatus') }}</span>
          <div class="status" style="background: #ff984f" @click="update">
            {{ $t('PendingUpgrade') }}
          </div>
        </div>
      </el-radio>
      <el-radio label="Polygon">
        <div class="top">
          <img src="@/assets/img/setting/chain/Polygon.svg" />
          <span>Polygon</span>
          <div class="check">
            <div class="dot"></div>
          </div>
        </div>
        <div class="bottom">
          <span>{{ $t('AccountStatus') }}</span>
          <div class="status" @click="deploy">{{ $t('NotDeployed') }}</div>
        </div>
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'

const chain = ref('ETH')
const { t: $t } = useI18n()

const update = () => {
  ElMessageBox.confirm($t('UpdateWalletConfiguration'), $t('Update'), {
    showClose: false,
  })
    .then(() => {})
    .catch(() => {})
}
const deploy = () => {
  ElMessageBox.confirm($t('DeployedWalletConfiguration'), $t('Deployed'), {
    showClose: false,
  })
    .then(() => {})
    .catch(() => {})
}
</script>

<style lang="scss">
#page-setting-chain {
  .el-radio-group {
    margin-top: 40px;
    display: flex;
    flex-direction: column;

    .el-radio {
      height: auto;
      width: 100%;
      margin: 0;
      background: var(--up-bg);
      border-radius: 12px;

      & + .el-radio {
        margin-top: 24px;
      }

      .el-radio__input {
        display: none;
      }

      .el-radio__label {
        color: inherit;
        padding: 0;
        width: 100%;
        .top {
          background: var(--up-bg);
          box-shadow: inset 1px 1px 3px 0px var(--up-line);
          border-radius: 12px;
          backdrop-filter: blur(8px);
          color: var(--up-text-primary);

          padding: 16px 20px;
          display: flex;
          align-items: center;
          img {
            margin-right: 12px;
          }
          .check {
            margin-left: auto;
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
        }
        .bottom {
          color: var(--up-text-primary);
          padding: 20px;
          // display: flex;
          display: none;
          align-items: center;
          font-size: 16px;
          font-weight: 400;
          line-height: 16px;
          .status {
            padding: 4px 8px;
            background: var(--up-line);
            border-radius: 4px;
            font-size: 16px;
            font-weight: 600;
            line-height: 16px;
          }
        }
      }

      &.is-checked {
        .top {
          .check {
            border-color: #8864ff;

            .dot {
              background: #8864ff;
            }
          }
        }
      }
    }
  }
}
</style>
