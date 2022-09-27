<template>
  <div id="page-demo" class="unipass-page">
    <i class="background-logo iconfont icon-logo"></i>
    <div class="head">UniPass Demo</div>
    <div v-if="myAddress">
      <div>
        <br />
        <h3>{{ myAddress }}</h3>
        <br />
      </div>
      <el-button class="transfer" type="primary" @click="logout">
        logout
      </el-button>
    </div>
    <div v-else>
      <br />
      <el-radio v-model="toTheme" label="dark">Dark</el-radio>
      <el-radio v-model="toTheme" label="light">Light</el-radio>
      <el-button type="primary" class="transfer login" @click="connect">
        login
      </el-button>
    </div>
    <el-tabs
      v-show="myAddress"
      v-model="activeTab"
      class="body"
      type="border-card"
    >
      <el-tab-pane label="RPG Transaction" name="sign_transaction">
        <el-form
          ref="form"
          class="body-input"
          label-position="top"
          :model="form"
        >
          <el-form-item label="Your Address:" prop="address">
            <template #label>
              <span>Your Address:</span>
              <i
                v-show="myAddress"
                class="iconfont icon-copy sea-background"
                @click="bindCopy"
              ></i>
            </template>
            <el-input
              v-model="myAddress"
              disabled
              readonly
              type="textarea"
              resize="none"
              :autosize="{ minRows: 1 }"
            />
          </el-form-item>
          <span>
            <b style="color: black">
              <a href="https://robin-faucet.rangersprotocol.com">
                Rangers Faucet:
              </a>
            </b>
          </span>
          <el-form-item label="Token Type:" prop="address">
            <el-radio-group v-model="tokenType">
              <el-radio-button label="RPG"></el-radio-button>
              <el-radio-button label="DAI(ERC20)"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Your Balance:" prop="address">
            <el-input v-model="myBalanceFormat" disabled readonly />
          </el-form-item>
          <el-form-item label="Transfer To:" prop="address">
            <el-input v-model="toAddress" clearable @blur="onAddressChanged" />
          </el-form-item>
          <el-form-item label="Amount:" prop="address">
            <el-input v-model="toAmount" clearable />
          </el-form-item>
          <el-form-item label="Fee(RPG):" prop="fee">
            <el-input v-model="toFeeAmount" clearable />
          </el-form-item>
          <el-form-item label="Description:" prop="description">
            <el-input v-model="toDescription" clearable />
          </el-form-item>
        </el-form>
        <br />
        <div v-if="tokenType === 'RPG'">
          <el-button type="primary" class="transfer" @click="sendRPG">
            sendRPG
          </el-button>
        </div>
        <div v-else>
          <el-button class="transfer" @click="sendToken"> sendToken </el-button>
          <br />
          <br />
          <el-button type="primary" class="transfer" @click="executeCall">
            executeCall
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
          ></el-input>
          <br />
          <div class="message">
            <el-button
              type="primary"
              class="message-button"
              @click="signMessage"
            >
              signMessage
            </el-button>
            <el-button type="primary" class="message-button" @click="verifySig">
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
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { UPEvent, UPEventType } from "@unipasswallet/popup-types";
import { UniPassPopupSDK, ChainType } from "@unipasswallet/popup-sdk";
import { ERC20ABI } from "./assets/erc20.abi";
import { isAddress, formatEther, parseEther } from "ethers/lib/utils";
import { Contract } from "ethers";
import { ElMessage } from "element-plus";

const DAI_ADDRESS = "0x6Cc8f0b5607E1F947E83667368881A1BCCc3f1C4";

export default defineComponent({
  data() {
    return {
      message: "TO BE SIGNED MESSAGE abc",
      sig: "",
      activeTab: "sign_transaction",
      tokenType: "RPG",
      myAddress: "",
      myRPGBalance: "0.00",
      myTokenBalance: "0.00",
      toAddress: "0x8291507Afda0BBA820efB6DFA339f09C9465215C",
      toAmount: "0.01",
      toFeeAmount: "0.000001",
      toDescription: "描述测试描述测试描述测试",
      toTheme: "dark",
      txHash: "",
      form: {},
      upRangers: new UniPassPopupSDK({
        chainType: ChainType.mainnet,
        upCoreConfig: {
          domain: "localhost:1900",
          protocol: "http",
        },
      }),
    };
  },
  computed: {
    myBalanceFormat(): string {
      const balance =
        this.tokenType === "RPG" ? this.myRPGBalance : this.myTokenBalance;
      return `${balance} ${this.tokenType}`;
    },
  },
  methods: {
    bindCopy() {
      this.$clipboard(this.myAddress);
      ElMessage.success("copy succeeded");
    },
    async connect() {
      console.log("connect clicked");
      try {
        const account = await this.upRangers.login({
          email: true,
          evmKeys: true,
          chain: {
            id: 2025,
            name: "Rangers Protocol Mainnet",
          },
          theme: this.toTheme as any,
          appName: "Rangers Demo",
          eventListener: (event: UPEvent) => {
            console.log("event", event);
            const { type, body } = event;
            if (type === UPEventType.REGISTER) {
              console.log("account", body);
              ElMessage.success("a user register");
            }
          },
        });
        console.log("account", account);

        this.myAddress = account.address;

        await this.refreshBalance();
      } catch (err) {
        ElMessage.error(err as string);
        console.log("connect err", err);
      }
    },
    async checkTxStatus(txHash: string) {
      let tryTimes = 0;
      while (tryTimes++ < 3) {
        const receipt = await this.upRangers
          .getProvider()
          .getTransactionReceipt(txHash);

        if (receipt) return receipt.status;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      return false;
    },
    onAddressChanged() {
      if (!isAddress(this.toAddress)) {
        ElMessage.error("address invalid");
      }
    },
    async refreshBalance() {
      this.myRPGBalance = formatEther(
        await this.upRangers.getProvider().getBalance(this.myAddress)
      );

      const tokenContract = new Contract(
        DAI_ADDRESS,
        ERC20ABI,
        this.upRangers.getProvider()
      );
      this.myTokenBalance = formatEther(
        await tokenContract.balanceOf(this.myAddress)
      );
    },
    logout() {
      console.log("connect clicked");
      this.upRangers.logout();
      this.myAddress = "";
    },
    async signMessage() {
      console.log("authorize clicked");
      this.sig = "";
      console.log({
        message: this.message,
      });
      try {
        const resp = await this.upRangers.signMessage(this.message);
        console.log("resp", resp);
        this.sig = JSON.stringify(resp);
      } catch (err) {
        ElMessage.error(err as string);
        console.log("auth err", err);
      }
    },

    async verifySig() {
      try {
        const ret = await this.upRangers.isValidSignature(
          this.message,
          this.sig
        );
        if (ret === true) {
          ElMessage.success("verify signature success");
        } else {
          ElMessage.error("verify signature failed");
        }
      } catch (err) {
        ElMessage.error(err as string);
        console.log("auth err", err);
      }
    },
    async sendRPG() {
      if (Number(this.myRPGBalance) < Number(this.toAmount)) {
        ElMessage.error("balance is not enough");
        return;
      }
      try {
        const tx = {
          to: this.toAddress,
          value: parseEther(this.toAmount),
          data: "0x",
        };

        this.txHash = await this.upRangers.sendTransaction(tx, {
          feeToken: {
            address: "0x0000000000000000000000000000000000000000",
            symbol: "RPG",
            decimals: 18,
          },
          feeAmount: parseEther(this.toFeeAmount),
        });
        if (await this.checkTxStatus(this.txHash)) {
          console.log("send RPG success", this.txHash);
          ElMessage.success(`send RPG success, tx hash = ${this.txHash}`);
        } else {
          ElMessage.error(`send RPG failed, tx hash = ${this.txHash}`);
        }
        await this.refreshBalance();
      } catch (err) {
        ElMessage.error(err as string);
        console.log("err", err);
      }
    },
    async sendToken() {},
    async executeCall() {},
  },
});
</script>

<style lang="scss">
#page-demo {
  max-width: 480px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  background: #F5F5FF;

  > * {
    z-index: 1;
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

  .head {
    text-align: left;
    font-family: Helvetica;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 20px;
    color: black;
  }

  .transfer {
    width: 100%;
    font-size: 20px;
  }

  .login {
    margin-top: 50px;
    font-size: 20px;
  }

  .body {
    border-radius: 24px;
    margin: 30px auto 0px;
    width: 100%;
    background: #FFFFFF;
    padding: 0px 0 21px;
    overflow: hidden;

    .body-input {
      margin-top: -20px;

      .icon-copy {
        cursor: pointer;
      }
    }

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
}

.unipass-page {
  padding: 24px;
  padding-top: 29px;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  text-align: center;
}
</style>
