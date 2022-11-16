<template>
  <div id="page">
    <i class="background-logo iconfont icon-logo"></i>
    <div class="head">UniPass Demo</div>
    <div class="page-demo">
      <div v-if="myAddress">
        <el-form class="body-input" label-position="top">
          <el-form-item label="Your Address" prop="address">
            <template #label>
              <span>Your Address</span>
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

          <el-form-item label="Your email" prop="address">
            <template #label>
              <span>Your email</span>
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

          <el-form-item label="New born" prop="address">
            <template #label>
              <span>New born</span>
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
        </el-form>
        <!-- <div>
          <br />
          <h3></h3>
          <br />
        </div>
        <el-button class="transfer" type="primary" @click="logout">
          logout
        </el-button>
        <el-tabs
          v-show="myAddress"
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
              <el-button
                type="primary"
                class="transfer"
                @click="sendNativeToken"
              >
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
      <div v-else>
        <el-radio-group v-model="toTheme">
          <el-radio label="dark">Dark mode</el-radio>
          <el-radio label="light">Light mode</el-radio>
        </el-radio-group>
        <br />
        <el-radio-group v-model="chainType">
          <el-radio-button label="polygon">Polygon-Mumbai</el-radio-button>
          <el-radio-button label="bsc">BSC-Testnet</el-radio-button>
          <el-radio-button label="rangers">Rangers-Robin</el-radio-button>
        </el-radio-group>
        <br />
        <br />
        <el-select
          v-model="list"
          class="m-2"
          placeholder="Mumbai (ChainID 80001)"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            size="16px"
          />
        </el-select>
        <div class="return">
          <div class="return_box">
            <div class="return_s">Return address</div>
            <el-switch
              v-model="returnAddress"
              disabled
              class="ml-2"
              style="--el-switch-on-color: #13ce66"
            />
          </div>
          <div class="return_box">
            <div class="return_s">Return email</div>
            <el-switch
              v-model="returnEmail"
              class="ml-2"
              style="--el-switch-on-color: #13ce66"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="page-demo">
      <div class="st_box">
        <div class="st"></div>
        <div class="users">Onboarding users through Google and Email</div>
        <div class="st"></div>
      </div>
      <el-button
        type="primary"
        class="transfer login"
        @click="connect('google')"
      >
        <img class="google_icon" src="@/assets/google.svg" /> Continue with
        Google
      </el-button>
      <el-button
        type="primary"
        class="transfer login"
        @click="connect('email')"
      >
        <img class="google_icon" src="@/assets/email.svg" />Continue with Email
      </el-button>
      <div class="divider"></div>
      <div class="st_box">
        <div class="st"></div>
        <div class="users">Connect UniPass through one button</div>
        <div class="st"></div>
      </div>
      <el-button type="primary" class="transfer login" @click="connect()">
        <img class="google_icon" src="@/assets/unipass.svg" />Connect UniPass
      </el-button>
    </div>
    <div class="page-demo">
      <div class="link_head">UniPass Document</div>
      <div class="box">
        <div class="link_box">
          <a class="link" href="https://unipass.id/" target="_blank">
            <div class="link_"></div>
            UniPass Website
          </a>
          <a
            class="link"
            href="https://docs.wallet.unipass.id/docs/develop/popup-sdk/quick-start"
            target="_blank"
          >
            <div class="link_"></div>
            Popup SDK
          </a>
        </div>
        <div class="link_box">
          <a
            class="link"
            href="https://docs.wallet.unipass.id/docs/develop/flutter-sdk/quick-start"
            target="_blank"
          >
            <div class="link_"></div>
            Flutter SDK
          </a>
          <a
            class="link"
            href="https://docs.wallet.unipass.id/docs/develop/unity-sdk/quick-start"
            target="_blank"
          >
            <div class="link_"></div>
            Unity SDK
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch, watchEffect } from "vue";
import {
  ChainType,
  ConnectType,
  UniPassTheme,
  UPAccount,
  UPEvent,
  UPEventType,
} from "@unipasswallet/popup-types";
import { UniPassPopupSDK } from "@unipasswallet/popup-sdk";
import { ERC20ABI } from "./assets/erc20.abi";
import {
  isAddress,
  formatEther,
  parseEther,
  formatUnits,
  Interface,
  parseUnits,
} from "ethers/lib/utils";
import { Contract } from "ethers";
import { ElMessage } from "element-plus";
import { onMounted } from "@vue/runtime-core";
const toTheme = ref("dark");
const list = ref("");
const options = [
  {
    value: "Option1",
    label: "Mumbai (ChainID 80001)",
  },
  {
    value: "Option2",
    label: "BSCtestnet (ChainID 97)",
  },
  {
    value: "Option3",
    label: "Ranger robin (ChainID 9527)",
  },
  {
    value: "Option4",
    label: "Goerli (ChainID 5)",
  },
];
const returnAddress = ref(true);
const returnEmail = ref(true);
const chainType = ref<ChainType>("polygon");

const myAddress = ref("");
const activeTab = ref("sign_transaction");
const message = ref("TO BE SIGNED MESSAGE abc");
const sig = ref("");
const myNativeTokenBalance = ref("0.00");
const myTokenBalance = ref("0.00");
const toAddress = ref("0x61E428AaB6347765eFc549eae7bd740aA886A707");
const toAmount = ref("0.01");
const txHash = ref("");

const CHAIN_CONFIGS: {
  [key in ChainType]: {
    rpc: string;
    nativeToken: string;
    usdc: {
      contract: string;
      decimals: number;
    };
  };
} = {
  polygon: {
    rpc: "https://node.wallet.unipass.id/polygon-mumbai",
    nativeToken: "MATIC",
    usdc: {
      contract: "0x87F0E95E11a49f56b329A1c143Fb22430C07332a",
      decimals: 6,
    },
  },
  bsc: {
    rpc: "https://node.wallet.unipass.id/bsc-testnet",
    nativeToken: "BNB",
    usdc: {
      contract: "0x64544969ed7EBf5f083679233325356EbE738930",
      decimals: 18,
    },
  },
  rangers: {
    rpc: "https://node.wallet.unipass.id/rangers-robin",
    nativeToken: "RPG",
    usdc: {
      contract: "0xd6Ed1C13914FF1b08737b29De4039F542162cAE1",
      decimals: 6,
    },
  },
};

let upWallet: UniPassPopupSDK;

onBeforeMount(() => {
  upWallet = new UniPassPopupSDK({
    env: "dev",
    chainType: chainType.value as ChainType,
    nodeRPC: CHAIN_CONFIGS[chainType.value].rpc,
    appSettings: {
      chain: chainType.value as ChainType,
      theme: toTheme.value as UniPassTheme,
      appName: "UniPass Popup Demo123",
      appIcon: "",
    },
    walletUrl: {
      domain: "testnet.wallet.unipass.id",
      protocol: "https",
    },
  });

  if (sessionStorage.getItem("__toTheme")) {
    toTheme.value = sessionStorage.getItem("__toTheme") || "dark";
  }
  if (sessionStorage.getItem("__chainType")) {
    chainType.value = (sessionStorage.getItem("__chainType") ||
      "polygon") as ChainType;
  }
  console.log("__toTheme", toTheme.value);
  console.log("__chainType", chainType.value);
});

onMounted(() => {
  const account = upWallet.getAccount();
  if (!account) return;
  myAddress.value = account.address;
  refreshBalance();
});

watch(toTheme, () => {
  updateUpWalletConfig();
  sessionStorage.setItem("__toTheme", toTheme.value);
});
watch(chainType, () => {
  updateUpWalletConfig();
  sessionStorage.setItem("__chainType", chainType.value);
});

const updateUpWalletConfig = () => {
  console.log(
    "config updated",
    chainType.value,
    CHAIN_CONFIGS[chainType.value].rpc
  );
  upWallet.updateConfig({
    chainType: chainType.value as ChainType,
    nodeRPC: CHAIN_CONFIGS[chainType.value].rpc,
    appSettings: {
      chain: chainType.value as ChainType,
      theme: toTheme.value as UniPassTheme,
      appName: "UniPass Popup Demo123",
      appIcon: "",
    },
  });
};

const myChainConfig = computed(() => {
  const config = CHAIN_CONFIGS[chainType.value];
  return config;
});

const tokenType = ref("RPG");

watchEffect(() => {
  tokenType.value = myChainConfig.value.nativeToken;
});

const tokens = computed(() => [
  {
    label: myChainConfig.value.nativeToken,
    value: myChainConfig.value.nativeToken,
    selected: true,
  },
  { label: "USDC", value: "USDC", selected: false },
]);

const myBalanceFormat = computed(() => {
  const balance =
    tokenType.value === myChainConfig.value.nativeToken
      ? myNativeTokenBalance.value
      : myTokenBalance.value;
  return `${balance} ${tokenType.value}`;
});

const bindCopy = () => {
  // this.$clipboard(this.myAddress);
  ElMessage.success("copy succeeded");
};

const connect = async (connectType?: ConnectType) => {
  try {
    const account = await upWallet.login({
      email: returnEmail.value,
      eventListener: (event: UPEvent) => {
        console.log("event", event);
        const { type, body } = event;
        if (type === UPEventType.REGISTER) {
          console.log("account", body);
          ElMessage.success("a user register");
        }
      },
      connectType,
    });
    console.log("account", account);
    myAddress.value = account.address;
    await refreshBalance();
  } catch (err: any) {
    ElMessage.error("user reject connection");
    console.log("connect error", err);
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
  console.log("provider", provider);
  const balance = await provider.getBalance(myAddress.value);
  myNativeTokenBalance.value = formatEther(balance);

  const tokenContract = new Contract(
    myChainConfig.value.usdc.contract,
    ERC20ABI,
    upWallet.getProvider()
  );
  myTokenBalance.value = formatUnits(
    await tokenContract.balanceOf(myAddress.value),
    myChainConfig.value.usdc.decimals
  );
  console.log(
    `native balance = ${myNativeTokenBalance.value} usdc balance = ${myTokenBalance.value}`
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
  } catch (err: any) {
    ElMessage.error(err?.message || "signMessage error");
    console.log("auth error", err?.message);
  }
};

const verifySig = async () => {
  try {
    const ret = await upWallet.isValidSignature(
      message.value,
      sig.value,
      myAddress.value
    );
    if (ret === true) {
      ElMessage.success("verify signature success");
    } else {
      ElMessage.error("verify signature failed");
    }
  } catch (err: any) {
    ElMessage.error(err?.message || "verifySig error");
    console.log("auth error", err?.message);
  }
};

const sendNativeToken = async () => {
  if (Number(myNativeTokenBalance.value) < Number(toAmount.value)) {
    ElMessage.error("balance is not enough");
    return;
  }

  try {
    const tx = {
      from: myAddress.value,
      to: toAddress.value,
      value: parseEther(toAmount.value).toHexString(),
      data: "0x",
    };
    txHash.value = await upWallet.sendTransaction(tx);
    if (await checkTxStatus(txHash.value)) {
      console.log("send NativeToken success", txHash);
      ElMessage.success(`send NativeToken success, tx hash = ${txHash.value}`);
    } else {
      ElMessage.error(`send NativeToken failed, tx hash = ${txHash.value}`);
    }
    await refreshBalance();
  } catch (err: any) {
    ElMessage.error(err?.message || "send NativeToken error");
    console.log("send NativeToken", err?.message);
  }
};

const sendToken = async () => {
  if (Number(myTokenBalance.value) < Number(toAmount.value)) {
    ElMessage.error("balance is not enough");
    return;
  }

  try {
    const erc20Interface = new Interface([
      "function transfer(address _to, uint256 _value)",
    ]);
    const erc20TokenData = erc20Interface.encodeFunctionData("transfer", [
      toAddress.value,
      parseUnits(toAmount.value, myChainConfig.value.usdc.decimals),
    ]);
    const tx = {
      from: myAddress.value,
      to: myChainConfig.value.usdc.contract,
      value: "0x",
      data: erc20TokenData,
    };
    txHash.value = await upWallet.sendTransaction(tx);
    if (await checkTxStatus(txHash.value)) {
      console.log("send USDC success", txHash);
      ElMessage.success(`send USDC success, tx hash = ${txHash.value}`);
    } else {
      ElMessage.error(`send USDC failed, tx hash = ${txHash.value}`);
    }
    await refreshBalance();
  } catch (err: any) {
    ElMessage.error(err?.message || "sendToken error");
    console.log("sendToken", err?.message);
  }
};
</script>

<style lang="scss">
#page {
  background-color: #f5f5f5;
  min-height: 100vh;

  .head {
    width: 100%;
    padding-top: 120px;
    padding-bottom: 40px;
    text-align: center;
    font-weight: 700;
    font-size: 28px;
    line-height: 40px;
    color: #1f202a;
  }
}

.page-demo {
  max-width: 560px;
  margin: 0 auto;
  padding: 40px;
  background: #ffffff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  text-align: center;

  & + .page-demo {
    margin-top: 40px;
  }
  .link_head {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #1f202a;
  }
  .el-form-item__content {
    height: 56px;
    background: #f5f5f5;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
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
    margin-top: 50px;
  }

  .el-select .el-input {
    width: 100%;
    height: 56px;
    background: #fcfcfc;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
  }
  .el-select {
    width: 100%;
  }
  .el-select .el-input__inner {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #1f202a;
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

  h4 {
    color: black;
    margin-top: 50px;
  }
}

.unipass-page {
}
</style>
