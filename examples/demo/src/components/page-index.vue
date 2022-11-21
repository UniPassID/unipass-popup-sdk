<template>
  <div id="page">
    <div class="demo_head">UniPass Demo ({{ userStore.chainType }})</div>
    <div class="page-demo">
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
      <!-- <el-tabs
        v-show="userStore.address"
        v-model="activeTab"
        class="body"
        type="border-card"
      >
        <el-tab-pane label="Transaction" name="sign_transaction">
          <el-form class="body-input" label-position="top">
            <el-form-item label="Your Address:" prop="address">
              <template #label>
                <span>Your Address:</span>
                <i
                  v-show="userStore.address"
                  class="iconfont icon-copy sea-background"
                  @click="bindCopy"
                ></i>
              </template>
              <el-input
                v-model="userStore.address"
                disabled
                readonly
                type="textarea"
                resize="none"
                :autosize="{ minRows: 1 }"
              />
            </el-form-item>

            <el-form-item label="Token Type:" prop="address">
              <el-radio-group v-model="tokenType">
                <el-radio-button
                  :label="item.value"
                  :key="item.value"
                  v-for="item in tokens"
                ></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Your Balance:" prop="address">
              <el-input v-model="myBalanceFormat" disabled readonly />
            </el-form-item>
            <el-form-item label="Transfer To:" prop="address">
              <el-input
                v-model="toAddress"
                clearable
                @blur="onAddressChanged"
              />
            </el-form-item>
            <el-form-item label="Amount:" prop="address">
              <el-input v-model="toAmount" clearable />
            </el-form-item>
          </el-form>
          <br />
          <div v-if="tokenType === myChainConfig.nativeToken">
            <el-button type="primary" class="transfer" @click="sendNativeToken">
              send{{ myChainConfig.nativeToken }}
            </el-button>
          </div>
          <div v-else>
            <el-button class="transfer" @click="sendToken">
              sendToken
            </el-button>
          </div>
          <div>{{ txHash }}</div>
        </el-tab-pane>
        <el-tab-pane label="Sign Message" name="sign_message">
          <div>
            <br />
            <h3 class="input">Message:</h3>
            <el-input
              v-model="message"
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 10 }"
              resize="none"
            >
            </el-input>
            <br />
            <div class="message">
              <el-button
                type="primary"
                class="message-button"
                @click="signMessage"
              >
                signMessage
              </el-button>
              <el-button
                type="primary"
                class="message-button"
                @click="verifySig"
              >
                verify
              </el-button>
            </div>
            <br />
            <div v-if="sig">
              <h3 class="input">Signature:</h3>
              <el-input
                v-model="sig"
                type="textarea"
                :autosize="{ minRows: 8, maxRows: 10 }"
                resize="none"
              ></el-input>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs> -->
    </div>
    <div class="page-demo">
      <div class="send_s">Send RPG</div>
      <el-form class="body-input" label-position="top">
        <el-form-item label="Your balance" prop="address">
          <template #label>
            <span class="label_s">Your balance</span>
          </template>
          <el-input
            :value="myNativeTokenBalance + ' RPG'"
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
      <div class="hash_box" v-show="txHash">
        <div class="label_hash">Transaction hash</div>
        <a :href="explorer" target="_blank">
          <div class="hash_th">
            {{ txHash }}
          </div>
        </a>
      </div>
    </div>

    <div class="page-demo">
      <div class="send_s">Send USDC</div>
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
      <div class="hash_box" v-show="txHash">
        <div class="label_hash">Transaction hash</div>
        <a :href="explorer" target="_blank">
          <div class="hash_th">
            {{ txHash }}
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
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useIndex } from "../composable/useIndex";

const {
  message,
  sig,
  toAddress,
  toAmount,
  txHash,
  bindCopy,
  onAddressChanged,
  logout,
  signMessage,
  verifySig,
  sendNativeToken,
  sendToken,
  userStore,
  myNativeTokenBalance,
  myTokenBalance,
} = useIndex();

const explorerDict = {
  bsc: "https://testnet.bscscan.com",
  rangers: "https://robin-rangersscan.rangersprotocol.com",
  eth: "https://goerli.etherscan.io",
  polygon: "https://mumbai.polygonscan.com",
};

const explorer = computed(() => {
  console.log("🌊", explorer);
  return explorerDict[userStore.chainType] + "/tx/" + txHash.value;
});
</script>

<style lang="scss">
#page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;

  .head {
    width: 100%;
    padding-top: 120px;
    text-align: center;
    font-weight: 700;
    font-size: 28px;
    line-height: 40px;
    color: #1f202a;
  }
}

.demo_head {
  margin-top: 120px;
  font-weight: 700;
  font-size: 28px;
  line-height: 40px;
  color: #1f202a;
}

.page-demo {
  width: 480px;
  margin-top: 40px;
  padding: 40px;
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
    border-radius: 6px;
    cursor: pointer;

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
      border-radius: 6px;
      padding: 16px !important;
    }
    .el-textarea {
      border-radius: 6px;

      background: #fcfcfc;
      &.is-disabled {
        border-radius: 6px;

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
    border-radius: 6px;
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
    border-radius: 6px;
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

.unipass-page {
}
</style>
