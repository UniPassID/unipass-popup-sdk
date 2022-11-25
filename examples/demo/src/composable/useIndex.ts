import { computed, onBeforeMount, ref, watch, watchEffect } from "vue";
import {
  ChainType,
  ConnectType,
  UniPassTheme,
  UPEvent,
  UPEventType,
} from "@unipasswallet/popup-types";
import { UniPassPopupSDK } from "@unipasswallet/popup-sdk";
import { ERC20ABI } from "../assets/erc20.abi";
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
import { onMounted } from "vue";
import { useUserStore } from "@/store/user";
import { useClipboard } from "@vueuse/core";

export const useIndex = () => {
  const userStore = useUserStore();
  const toTheme = ref("dark");

  const options = [
    {
      value: "polygon",
      label: "Polygon Mainnet",
    },
    {
      value: "bsc",
      label: "Bsc Mainnet",
    },
    {
      value: "rangers",
      label: "Rangers Mainnet robin",
    },
    {
      value: "eth",
      label: "Eth Mainnet",
    },
  ];
  const returnAddress = ref(true);
  const returnEmail = ref(true);
  const chainType = ref<ChainType>("polygon");

  const activeTab = ref("sign_transaction");
  const message = ref("Welcome to UniPass!");
  const sig = ref("");
  const myNativeTokenBalance = ref("0.00");
  const myTokenBalance = ref("0.00");
  const toAddress = ref("0x61E428AaB6347765eFc549eae7bd740aA886A707");
  const toAmount = ref("0.01");
  const txHashNative = ref("");
  const txHashERC20 = ref("");

  const CHAIN_CONFIGS: {
    [key in ChainType]: {
      name: string;
      rpc: string;
      nativeToken: string;
      usdc: {
        contract: string;
        decimals: number;
      };
    };
  } = {
    polygon: {
      name: "Polygon-mainnet",
      rpc: "https://node.wallet.unipass.id/polygon-mainnet",
      nativeToken: "MATIC",
      usdc: {
        contract: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        decimals: 6,
      },
    },
    bsc: {
      name: "BSC-mainnet",
      rpc: "https://node.wallet.unipass.id/bsc-mainnet",
      nativeToken: "BNB",
      usdc: {
        contract: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        decimals: 18,
      },
    },
    rangers: {
      name: "Rangers-mainnet",
      rpc: "https://node.wallet.unipass.id/rangers-mainnet",
      nativeToken: "RPG",
      // this is rangers's usdt contract
      usdc: {
        contract: "0x8e8816a1747fddc5f8b45d2e140a425d3788f659",
        decimals: 18,
      },
    },
    eth: {
      name: "ETH-mainnet",
      rpc: "https://node.wallet.unipass.id/eth-mainnet",
      nativeToken: "ETH",
      usdc: {
        contract: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        decimals: 6,
      },
    },
  };

  let upWallet: UniPassPopupSDK;
  const domain = "m.wallet.unipass.vip";
  const protocol = "https";

  onBeforeMount(() => {
    upWallet = new UniPassPopupSDK({
      env: "dev",
      chainType: userStore.chainType as ChainType,
      nodeRPC: CHAIN_CONFIGS[userStore.chainType].rpc,
      appSettings: {
        chain: userStore.chainType as ChainType,
        theme: toTheme.value as UniPassTheme,
        appName: "UniPass Popup Demo123",
        appIcon: "",
      },
      walletUrl: {
        domain,
        protocol,
      },
    });

    if (sessionStorage.getItem("__toTheme")) {
      toTheme.value = sessionStorage.getItem("__toTheme") || "dark";
    }
    if (sessionStorage.getItem("__chainType")) {
      userStore.chainType = (sessionStorage.getItem("__chainType") ||
        "polygon") as ChainType;
    }
    console.log("__toTheme", toTheme.value);
    console.log("__chainType", userStore.chainType);
  });

  onMounted(() => {
    const account = upWallet.getAccount();
    if (!account) return;
    userStore.address = account.address;
    userStore.email = account.email || "";
    userStore.newborn = account.newborn || false;
    refreshBalance();
  });

  watch(toTheme, () => {
    updateUpWalletConfig();
    sessionStorage.setItem("__toTheme", toTheme.value);
  });
  const chainChange = () => {
    updateUpWalletConfig();
    sessionStorage.setItem("__chainType", userStore.chainType);
  };

  const updateUpWalletConfig = () => {
    console.log(
      "config updated",
      userStore.chainType,
      CHAIN_CONFIGS[userStore.chainType].rpc
    );
    upWallet.updateConfig({
      chainType: userStore.chainType as ChainType,
      nodeRPC: CHAIN_CONFIGS[userStore.chainType].rpc,
      appSettings: {
        chain: userStore.chainType as ChainType,
        theme: toTheme.value as UniPassTheme,
        appName: "UniPass Popup Demo123",
        appIcon: "https://cdn.sea.team/avatar/2-avatar?t=1661419894383",
      },
    });
  };

  const myChainConfig = computed(() => {
    const config = CHAIN_CONFIGS[userStore.chainType];
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

  const bindCopy = (v: string) => {
    const { copy } = useClipboard();
    copy(v);
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
      userStore.address = account.address;
      userStore.email = account.email || "";
      userStore.newborn = account.newborn || false;
      await refreshBalance();
    } catch (err: any) {
      ElMessage.error("user reject connection");
      console.log("connect error", err);
    }
  };

  const checkTxStatus = async (txHash: string) => {
    let tryTimes = 0;
    while (tryTimes++ < 3) {
      const receipt = await upWallet
        .getProvider()
        .getTransactionReceipt(txHash);
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
    const balance = await provider.getBalance(userStore.address);
    myNativeTokenBalance.value = formatEther(balance);

    const tokenContract = new Contract(
      myChainConfig.value.usdc.contract,
      ERC20ABI,
      upWallet.getProvider()
    );
    myTokenBalance.value = formatUnits(
      await tokenContract.balanceOf(userStore.address),
      myChainConfig.value.usdc.decimals
    );
    console.log(
      `native balance = ${myNativeTokenBalance.value} usdc balance = ${myTokenBalance.value}`
    );
  };

  const logout = () => {
    console.log("connect clicked");
    upWallet.logout();
    userStore.address = "";
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
        userStore.address
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
        from: userStore.address,
        to: toAddress.value,
        value: parseEther(toAmount.value).toHexString(),
        data: "0x",
      };
      txHashNative.value = await upWallet.sendTransaction(tx);
      if (await checkTxStatus(txHashNative.value)) {
        console.log("send NativeToken success", txHashNative);
        ElMessage.success(
          `send NativeToken success, tx hash = ${txHashNative.value}`
        );
      } else {
        ElMessage.error(
          `send NativeToken failed, tx hash = ${txHashNative.value}`
        );
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
        from: userStore.address,
        to: myChainConfig.value.usdc.contract,
        value: "0x",
        data: erc20TokenData,
      };
      txHashERC20.value = await upWallet.sendTransaction(tx);
      if (await checkTxStatus(txHashERC20.value)) {
        console.log("send USDC success", txHashERC20);
        ElMessage.success(`send USDC success, tx hash = ${txHashERC20.value}`);
      } else {
        ElMessage.error(`send USDC failed, tx hash = ${txHashERC20.value}`);
      }
      await refreshBalance();
    } catch (err: any) {
      ElMessage.error(err?.message || "sendToken error");
      console.log("sendToken", err?.message);
    }
  };

  return {
    domain,
    protocol,
    toTheme,
    options,
    returnAddress,
    returnEmail,
    chainType,
    activeTab,
    message,
    sig,
    toAddress,
    toAmount,
    txHashNative,
    txHashERC20,
    updateUpWalletConfig,
    myChainConfig,
    tokenType,
    tokens,
    myBalanceFormat,
    bindCopy,
    connect,
    onAddressChanged,
    logout,
    signMessage,
    verifySig,
    sendNativeToken,
    sendToken,
    userStore,

    myNativeTokenBalance,
    myTokenBalance,

    chainChange,

    CHAIN_CONFIGS,
  };
};
