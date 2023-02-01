<template>
  <div id="page-index">
    <div class="demo-head">
      UniPass Demo ({{ CHAIN_CONFIGS[userStore.chainType].name }})
    </div>

    <div class="page-demo">
      <a class="polygon_bt" target="_blank" :href="`${protocol}://${domain}`">
        Open Wallet
      </a>
      <br />
      <el-form class="body-input" label-position="top">
        <el-form-item label="Your address" prop="address">
          <template #label>
            <span class="label_s">Your address</span>
          </template>
          <el-input
            v-model="userStore.address"
            disabled
            readonly
            type="textarea"
            resize="none"
            :autosize="{ minRows: 1 }"
          >
          </el-input>
          <div class="copy" @click="bindCopy(userStore.address)">
            <img src="@/assets/copy.svg" />
          </div>
        </el-form-item>

        <el-form-item label="Your email" prop="address">
          <template #label>
            <span class="label_s">Your email</span>
          </template>
          <el-input
            v-model="userStore.email"
            disabled
            readonly
            type="textarea"
            resize="none"
            :autosize="{ minRows: 1 }"
          />
          <div class="copy" @click="bindCopy(userStore.email)">
            <img src="@/assets/copy.svg" />
          </div>
        </el-form-item>

        <el-form-item label="New born" prop="address">
          <template #label>
            <span class="label_s">New born</span>
          </template>
          <el-input
            v-model="userStore.newborn"
            disabled
            readonly
            type="textarea"
            resize="none"
            :autosize="{ minRows: 1 }"
          />
        </el-form-item>
      </el-form>
      <button class="polygon_bt" @click="logout">Disconnect</button>
    </div>

    <div class="page-demo">
      <div class="send_s">Send ETH</div>
      <el-form class="body-input" label-position="top">
        <el-form-item label="Your balance" prop="address">
          <template #label>
            <span class="label_s">Your balance</span>
          </template>
          <el-input
            :value="
              myNativeTokenBalance +
              ' ' +
              CHAIN_CONFIGS[userStore.chainType].nativeToken
            "
            disabled
            readonly
            type="textarea"
            resize="none"
            :autosize="{ minRows: 1 }"
          />
        </el-form-item>

        <el-form-item label="Transfer to" prop="address">
          <template #label>
            <span class="label_s">Transfer to</span>
          </template>
          <el-input
            v-model="toAddress"
            clearable
            @blur="onAddressChanged"
            type="textarea"
            resize="none"
            :spellcheck="false"
            :autosize="{ minRows: 1 }"
          />
        </el-form-item>

        <el-form-item label="Amount" prop="address">
          <template #label>
            <span class="label_s">Amount</span>
          </template>
          <el-input
            v-model="toAmount"
            clearable
            @blur="onAddressChanged"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 1 }"
          />
        </el-form-item>
      </el-form>
      <button class="polygon_bt" @click="sendNativeToken">Send</button>
      <div class="hash_box" v-show="txHashNative">
        <div class="label_hash">Transaction hash</div>
        <a :href="explorerNative" target="_blank">
          <div class="hash_th">
            {{ txHashNative }}
          </div>
        </a>
      </div>
    </div>

    <div class="page-demo">
      <div class="send_s">Send ERC20</div>
      <el-form class="body-input" label-position="top">
        <el-form-item label="Your Balance" prop="address">
          <template #label>
            <span class="label_s">Your balance</span>
          </template>
          <el-input
            :value="myTokenBalance + ' USDC'"
            disabled
            readonly
            type="textarea"
            resize="none"
            :autosize="{ minRows: 1 }"
          />
        </el-form-item>

        <el-form-item label="Transfer to" prop="address">
          <template #label>
            <span class="label_s">Transfer to</span>
          </template>
          <el-input
            v-model="toAddress"
            clearable
            @blur="onAddressChanged"
            type="textarea"
            resize="none"
            :spellcheck="false"
            :autosize="{ minRows: 1 }"
          />
        </el-form-item>

        <el-form-item label="Amount" prop="address">
          <template #label>
            <span class="label_s">Amount</span>
          </template>
          <el-input
            v-model="toAmount"
            clearable
            @blur="onAddressChanged"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 1 }"
          />
        </el-form-item>
      </el-form>
      <button class="polygon_bt" @click="sendToken">Send</button>
      <div class="hash_box" v-show="txHashERC20">
        <div class="label_hash">Transaction hash</div>
        <a :href="explorerERC20" target="_blank">
          <div class="hash_th">
            {{ txHashERC20 }}
          </div>
        </a>
      </div>
    </div>

    <div class="page-demo">
      <div class="send_s">Sign Message</div>
      <div class="label_s">Message</div>
      <div class="message_pt_s">
        <el-input
          class="message_pt"
          v-model="message"
          type="textarea"
          resize="none"
          :autosize="{ minRows: 1 }"
        />
      </div>
      <button class="polygon_bt" @click="signMessage">Sign Message</button>
      <template v-if="sig">
        <div class="label_s signature_s">Signature</div>
        <div class="message_pt_s">
          <el-input
            class="message_pt"
            v-model="sig"
            type="textarea"
            resize="none"
            disabled
            :autosize="{ minRows: 1 }"
          />
        </div>
        <button class="polygon_bt" @click="verifySig">Verify</button>
      </template>
    </div>

    <div class="page-demo">
      <div class="send_s">Sign Typed Data V4</div>
      <div class="typed_data">
        <json-viewer :value="eip712DemoData" :expand-depth="5"></json-viewer>
      </div>
      <button class="polygon_bt" @click="signTypedData">Sign Typed Data</button>
      <template v-if="eip712Sig">
        <div class="label_s signature_s">Signature</div>
        <div class="message_pt_s">
          <el-input
            class="message_pt"
            v-model="eip712Sig"
            type="textarea"
            resize="none"
            disabled
            :autosize="{ minRows: 1 }"
          />
        </div>
        <button class="polygon_bt" @click="verifyTypedSig">
          Verify Typed Data
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useIndex } from "../composable/useIndex";

const {
  domain,
  protocol,
  message,
  sig,
  eip712Sig,
  toAddress,
  toAmount,
  txHashNative,
  txHashERC20,
  bindCopy,
  onAddressChanged,
  logout,
  signMessage,
  signTypedData,
  eip712DemoData,
  verifySig,
  verifyTypedSig,
  sendNativeToken,
  sendToken,
  userStore,
  myNativeTokenBalance,
  myTokenBalance,
  CHAIN_CONFIGS,
} = useIndex();

const explorerDict = {
  bsc: "https://testnet.bscscan.com",
  rangers: "https://robin-rangersscan.rangersprotocol.com",
  eth: "https://goerli.etherscan.io",
  polygon: "https://mumbai.polygonscan.com",
  scroll: "",
  arbitrum: "",
};

const explorerNative = computed(() => {
  return explorerDict[userStore.chainType] + "/tx/" + txHashNative.value;
});
const explorerERC20 = computed(() => {
  return explorerDict[userStore.chainType] + "/tx/" + txHashERC20.value;
});
const openWallet = () => {
  window.open(`${protocol}://${domain}`, "_blank");
};
</script>

<style lang="scss">
#page-index {
  background-color: #f5f5f5;
  padding: 0 24px;

  .head {
    width: 100%;
    padding-top: 120px;
    text-align: center;
    font-weight: 700;
    font-size: 28px;
    line-height: 40px;
    color: #1f202a;
  }

  .demo-head {
    text-align: center;
    margin-top: 120px;
    font-weight: 700;
    font-size: 28px;
    line-height: 40px;
    color: #1f202a;
  }

  .page-demo {
    max-width: 560px;
    margin: 0 auto;
    margin-top: 40px;
    padding: 40px 24px;
    background: #ffffff;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    text-align: center;

    & + .page-demo {
    }

    .el-form-item__content {
    }

    .send_s {
      margin-bottom: 40px;
      font-weight: 700;
      font-size: 24px;
      line-height: 36px;
      color: #1f202a;
    }

    .typed_data {
      text-align: left;
    }

    .signature_s {
      margin-top: 40px;
    }

    .polygon_bt {
      height: 56px;
      margin-top: 20px;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: #ffffff;
      background: #8864ff;
      border: 0;
      border-radius: 8px;
      cursor: pointer;

      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        background: #6440da;
      }
    }

    .link_head {
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: #1f202a;
    }

    .el-form-item__content {
      .el-textarea__inner {
        overflow: hidden;
        height: 56px !important;
        background: #f5f5f5;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        padding: 16px !important;
      }
      .el-textarea {
        border-radius: 8px;

        background: #fcfcfc;
        &.is-disabled {
          border-radius: 8px;

          background: #f5f5f5;
        }
      }
    }

    .el-form-item {
      margin-bottom: 20px;
    }

    .box {
      display: flex;
      justify-content: center;
      align-items: center;

      .link_box {
        display: flex;
        flex-direction: column;
        text-align: left;
      }
    }

    .link_ {
      width: 1px;
      height: 1px;
      border: 1px solid #5575ff;
      border-radius: 50%;
      margin-right: 10px;
    }

    .link {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #5575ff;
    }

    .st_box {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 8px;

      .users {
        margin: 0 10px;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        color: #1f202a;
      }

      .st {
        width: 50px;
        height: 1px;
        border: 1px solid #e5e5e5;
      }
    }

    .google_icon {
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }

    > .background-logo {
      font-size: 237px;
      position: absolute;
      top: 16px;
      right: -40px;
      color: #5575ff;
      opacity: 0.14;
      z-index: 0;
    }

    .divider {
      margin-top: 40px;
    }

    .return {
      margin-top: 40px;

      .return_box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        & + .return_box {
          margin-top: 28px;
        }

        .return_s {
          font-weight: 600;
          font-size: 16px;
          line-height: 24px;
        }
      }
    }

    .transfer {
      width: 100%;
      font-size: 16px;
      height: 56px;
      background: #f7f7f7;
      border-radius: 8px;
      color: #1f202a;
      font-weight: 600;
      line-height: 24px;
    }

    .login {
      margin-top: 20px;
      margin-left: 0 !important;
    }

    .label_s {
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      text-align: left;
      color: #1f202a;
    }

    .message_pt_s {
      min-height: 200px;
      margin-top: 8px;
      background: #fcfcfc;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: #1f202a;
    }

    .message_pt {
      width: 100%;
    }

    .el-textarea__inner {
      padding: 0;
      min-height: 24px;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: #1f202a;
    }

    .label_hash {
      font-weight: 600;
      font-size: 16px;
      text-align: left;
      line-height: 24px;
      color: #1f202a;
    }

    .hash_box {
      margin-top: 40px !important;
    }

    .hash_th {
      width: 480px;
      font-weight: 400;
      margin-top: 10px;
      font-size: 14px;
      line-height: 20px;
      text-align: left;
      word-wrap: break-word;
      text-decoration-line: underline;
      color: #4aac4c;
    }

    .body-input {
      .el-form-item__content {
        position: relative;

        .copy {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 17px;
        }
      }
    }

    .body {
      border-radius: 24px;
      margin: 30px auto 0px;
      width: 100%;
      background: #ffffff;
      padding: 0px 0 21px;
      overflow: hidden;

      .input {
        text-align: left;
        margin-bottom: 20px;
      }
    }

    .message {
      display: flex;
      justify-content: space-between;

      .message-button {
        margin-top: 30px;
        width: 48%;
        font-size: 20px;
      }
    }

    h4 {
      color: black;
      margin-top: 50px;
    }
  }
}
</style>
