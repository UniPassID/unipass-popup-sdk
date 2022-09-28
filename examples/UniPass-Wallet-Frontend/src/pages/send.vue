<template>
  <div id="page-send">
    <up-header :title="$t('Send')" :back="back" />
    <up-sign v-if="form.showSign" @cancel="form.showSign = false" />
    <el-form v-else @submit.prevent ref="formElement" :model="form" class="send-form">
      <div class="label">{{ $t('Title') }}</div>
      <div class="token">
        <up-token
          type="index"
          :name="form.coin.symbol"
          :chain="form.coin.chain"
          :subtitle="`${$t('Balance')} ${form.coin.balance} ${form.coin.symbol}`"
        />
        <up-form-item
          class="amount"
          prop="toAmount"
          :rules="[
            { required: true, message: $t('EnterAmount'), trigger: 'blur' },
            { validator: checkAmount, trigger: 'blur' },
          ]"
        >
          <up-input v-model.trim="form.toAmount" placeholder="0" @keydown.enter="submit">
            <template #suffix>
              <div class="dollar">~$0.00</div>
              <div class="line"></div>
              <el-button link @click="maxAmount">{{ $t('Maximum') }}</el-button>
            </template>
          </up-input>
        </up-form-item>
      </div>
      <div class="label">{{ $t('SendTo') }}</div>
      <up-form-item
        :label="form.toAddress && $t('EthAddress')"
        :rules="[{ required: true, message: $t('EnterEthAddress'), trigger: 'blur' }]"
        prop="toAddress"
        class="to-address"
      >
        <up-input
          :placeholder="$t('EthAddress')"
          v-model.trim="form.toAddress"
          :spellcheck="false"
          @keydown.enter="submit"
        />
      </up-form-item>
      <up-button type="primary" class="submit" @click="submit">{{ $t('Continue') }}</up-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useSend } from '@/composable/useSend'

const { form, formElement, maxAmount, submit, checkAmount, back } = useSend()
</script>

<style lang="scss">
#page-send {
  .send-form {
    .label {
      text-align: left;
      margin-top: 20px;
      font-size: 20px;
      font-weight: 600;
      line-height: 20px;
    }
    .token {
      margin-top: 20px;
      padding: 20px;
      background: var(--up-bg);
      border-radius: 12px;
      .amount {
        margin-top: 20px;
        .up-input {
          font-size: 20px;
          font-weight: 600;
          color: var(--up-text-third);
          .dollar {
            font-size: 14px;
            font-weight: 400;
            color: var(--up-text-third);
          }
          .line {
            margin: 16px;
            width: 1px;
            height: 18px;
            border: 1px solid var(--up-line);
          }
          .el-button {
            font-size: 16px;
            font-weight: 400;
          }
        }
      }
    }
    .to-address {
      margin-top: 20px;
    }
    .submit {
      margin-top: 40px;
    }
  }
}
</style>
