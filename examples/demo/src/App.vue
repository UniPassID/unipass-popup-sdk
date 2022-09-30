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
        <el-form class="body-input" label-position="top">
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
          <!-- <el-form-item label="Fee(RPG):" prop="fee">
            <el-input v-model="toFeeAmount" clearable />
          </el-form-item>
          <el-form-item label="Description:" prop="description">
            <el-input v-model="toDescription" clearable />
          </el-form-item> -->
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

<script setup lang="ts">
import { computed, ref } from "vue";
import { UniPassTheme, UPEvent, UPEventType } from "@unipasswallet/popup-types";
import { UniPassPopupSDK } from "@unipasswallet/popup-sdk";
import { ERC20ABI } from "./assets/erc20.abi";
import { isAddress, formatEther, parseEther } from "ethers/lib/utils";
import { Contract } from "ethers";
import { ElMessage } from "element-plus";

const DAI_ADDRESS = "0x25c58Aa062Efb4f069bD013De3e3C5797fb40651";

const myAddress = ref("");
const toTheme = ref("dark");
const activeTab = ref("sign_transaction");
const message = ref("TO BE SIGNED MESSAGE abc");
const sig = ref("");
const tokenType = ref("RPG");
const myRPGBalance = ref("0.00");
const myTokenBalance = ref("0.00");
const toAddress = ref("0x61E428AaB6347765eFc549eae7bd740aA886A707");
const toAmount = ref("0.01");
const txHash = ref("");
const upWallet = new UniPassPopupSDK({
  env: "dev",
  chainType: "rangers",
  nodeRPC: "https://node.wallet.unipass.id/rangers-robin",
  // chainType: "polygon",
  // nodeRPC: "https://node.wallet.unipass.id/polygon-mumbai",
  appSettings: {
    // chain: "polygon",
    chain: "rangers",
    theme: toTheme.value as UniPassTheme,
    appName: "Rangers Demo",
    appIcon: "",
  },
  walletUrl: {
    domain: "popup-wallet.unipass.vip",
    protocol: "https",
  },
});

const myBalanceFormat = computed(() => {
  const balance =
    tokenType.value === "RPG" ? myRPGBalance.value : myTokenBalance.value;
  return `${balance} ${tokenType.value}`;
});

const bindCopy = () => {
  // this.$clipboard(this.myAddress);
  ElMessage.success("copy succeeded");
};

const connect = async () => {
  upWallet.updateConfig({
    appSettings: {
      theme: toTheme.value as UniPassTheme,
    },
  });
  try {
    const account = await upWallet.login({
      email: true,
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
    myAddress.value = account.address;
    await refreshBalance();
  } catch (err) {
    ElMessage.error(err as string);
    console.log("connect err", err);
  }
};

const checkTxStatus = async (txHash: string) => {
  let tryTimes = 0;
  while (tryTimes++ < 3) {
    const receipt = await upWallet.getProvider().getTransactionReceipt(txHash);
    if (receipt) return receipt.status;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
};

const onAddressChanged = () => {
  if (!isAddress(toAddress.value)) {
    ElMessage.error("address invalid");
  }
};

const refreshBalance = async () => {
  const provider = upWallet.getProvider();
  const balance = await provider.getBalance(myAddress.value);
  myRPGBalance.value = formatEther(balance);

  const tokenContract = new Contract(
    DAI_ADDRESS,
    ERC20ABI,
    upWallet.getProvider()
  );
  myTokenBalance.value = formatEther(
    await tokenContract.balanceOf(myAddress.value)
  );
};

const logout = () => {
  console.log("connect clicked");
  upWallet.logout();
  myAddress.value = "";
};

const signMessage = async () => {
  console.log("authorize clicked");
  sig.value = "";
  console.log({
    message: message,
  });
  try {
    const resp = await upWallet.signMessage(message.value);
    console.log("resp", resp);
    sig.value = resp;
  } catch (err) {
    ElMessage.error(err as string);
    console.log("auth err", err);
  }
};

const verifySig = async () => {
  try {
    const ret = await upWallet.isValidSignature(message.value, sig.value);
    if (ret === true) {
      ElMessage.success("verify signature success");
    } else {
      ElMessage.error("verify signature failed");
    }
  } catch (err) {
    ElMessage.error(err as string);
    console.log("auth err", err);
  }
};

const sendRPG = async () => {
  if (Number(myRPGBalance.value) < Number(toAmount.value)) {
    ElMessage.error("balance is not enough");
    return;
  }

  upWallet.updateConfig({
    appSettings: {
      chain: "rangers",
    },
  });

  try {
    const tx = {
      from: myAddress.value,
      to: toAddress.value,
      value: parseEther(toAmount.value).toHexString(),
      data: "0x",
    };
    txHash.value = await upWallet.sendTransaction(tx);
    if (await checkTxStatus(txHash.value)) {
      console.log("send RPG success", txHash);
      ElMessage.success(`send RPG success, tx hash = ${txHash.value}`);
    } else {
      ElMessage.error(`send RPG failed, tx hash = ${txHash.value}`);
    }
    await refreshBalance();
  } catch (err) {
    ElMessage.error(err as string);
    console.log("err", err);
  }
};

const sendToken = async () => {};

const executeCall = () => {};
</script>

<style lang="scss">
#page-demo {
  max-width: 480px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  background: #f5f5ff;

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
    background: #ffffff;
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
