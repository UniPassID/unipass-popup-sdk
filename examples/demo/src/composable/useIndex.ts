import { useUserStore } from "@/store/user";
import { UniPassPopupSDK } from "@unipasswallet/popup-sdk";
import {
  ChainType,
  ConnectType,
  MessageTypes,
  TypedMessage,
  UniPassTheme,
  UPEvent,
  UPEventType,
} from "@unipasswallet/popup-types";
import type { TypedData } from "@unipasswallet/popup-utils";
import {
  verifyMessageSignature,
  verifyTypedDataSignature,
} from "@unipasswallet/popup-utils";
import { useClipboard } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { Contract, Wallet } from "ethers";
import {
  formatEther,
  formatUnits,
  Interface,
  isAddress,
  parseEther,
  parseUnits,
} from "ethers/lib/utils";
import {
  computed,
  onBeforeMount,
  onMounted,
  ref,
  watch,
  watchEffect,
} from "vue";
import { ERC20ABI } from "../assets/erc20.abi";

export const useIndex = () => {
  const userStore = useUserStore();
  const toTheme = ref("dark");

  const options = [
    {
      value: "polygon",
      label: "Mumbai (ChainID 80001)",
    },
    {
      value: "bsc",
      label: "BSCtestnet (ChainID 97)",
    },
    {
      value: "rangers",
      label: "Rangers robin (ChainID 9527)",
    },
    {
      value: "eth",
      label: "Goerli (ChainID 5)",
    },
  ];
  const returnAddress = ref(true);
  const returnEmail = ref(true);
  const chainType = ref<ChainType>("polygon");

  const activeTab = ref("sign_transaction");
  const message = ref("Welcome to UniPass!");
  const sig = ref("");
  const eip712Sig = ref("");
  const myNativeTokenBalance = ref("0.00");
  const myTokenBalance = ref("0.00");
  const toAddress = ref("0x61E428AaB6347765eFc549eae7bd740aA886A707");
  const toAmount = ref("0.01");
  const txHashNative = ref("");
  const txHashERC20 = ref("");
  const eip712DemoData: TypedMessage<MessageTypes> = {
    types: {
      EIP712Domain: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "version",
          type: "string",
        },
        {
          name: "chainId",
          type: "uint256",
        },
        {
          name: "verifyingContract",
          type: "address",
        },
      ],
      Person: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "wallet",
          type: "address",
        },
      ],
      Mail: [
        {
          name: "from",
          type: "Person",
        },
        {
          name: "to",
          type: "Person",
        },
        {
          name: "contents",
          type: "string",
        },
      ],
    },
    primaryType: "Mail",
    domain: {
      name: "Ether Mail",
      version: "1",
      chainId: 1,
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
    },
    message: {
      from: {
        name: "Cow",
        wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
      },
      to: {
        name: "Bob",
        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
      contents: "Hello, Bob!",
    },
  };

  // @ts-ignore
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
      name: "Polygon-mumbai",
      rpc: "https://node.wallet.unipass.id/polygon-mumbai",
      nativeToken: "MATIC",
      usdc: {
        contract: "0x87F0E95E11a49f56b329A1c143Fb22430C07332a",
        decimals: 6,
      },
    },
    bsc: {
      name: "BSC-testnet",
      rpc: "https://node.wallet.unipass.id/bsc-testnet",
      nativeToken: "BNB",
      usdc: {
        contract: "0x64544969ed7EBf5f083679233325356EbE738930",
        decimals: 18,
      },
    },
    rangers: {
      name: "Rangers-robin",
      rpc: "https://node.wallet.unipass.id/rangers-robin",
      nativeToken: "RPG",
      usdc: {
        contract: "0xd6Ed1C13914FF1b08737b29De4039F542162cAE1",
        decimals: 6,
      },
    },
    eth: {
      name: "ETH-goerli",
      rpc: "https://node.wallet.unipass.id/eth-goerli",
      nativeToken: "ETH",
      usdc: {
        contract: "0x365E05Fd986245d14c740c139DF8712AD8807874",
        decimals: 6,
      },
    },
  };

  let upWallet: UniPassPopupSDK;
  const domain = "testnet.wallet.unipass.id";
  const protocol = "https";
  // const domain = "localhost:1901";
  // const protocol = "http";

  onBeforeMount(() => {
    upWallet = new UniPassPopupSDK({
      env: "test",
      chainType: userStore.chainType as ChainType,
      appSettings: {
        theme: toTheme.value as UniPassTheme,
        appName: "UniPass Popup Demo",
        appIcon: "",
      },
      storageType: "localStorage",
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
    userStore.message = account.message || "";
    userStore.signature = account.signature || "";
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
        appName: "UniPass Popup Demo",
        appIcon: "",
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
      const randomWallet = Wallet.createRandom();
      const randomPrivateKey = randomWallet.privateKey;
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
        starkKeyMessage: "Hello Stark Key",
        sessionKeyAddress: randomWallet.address,
      });
      console.log("account", account);
      console.log("randomPrivateKey", randomPrivateKey);
      userStore.address = account.address;
      userStore.email = account.email || "";
      userStore.newborn = account.newborn || false;
      await refreshBalance();
    } catch (err: any) {
      ElMessage.error("user reject connection");
      console.error(err);
    }
  };

  const connectAndAuth = async () => {
    try {
      const account = await upWallet.login({
        email: returnEmail.value,
        authorize: true,
        starkKeyMessage: "Hello Stark Key",
        sessionKeyAddress: "0x0625cCD51134F3B0c537176A5B363CBE81102DC6",
        eventListener: (event: UPEvent) => {
          console.log("event", event);
          const { type, body } = event;
          if (type === UPEventType.REGISTER) {
            console.log("account", body);
            ElMessage.success("a user register");
          }
        },
      });
      console.log(account);

      userStore.address = account.address;
      userStore.email = account.email || "";
      userStore.newborn = account.newborn || false;
      userStore.message = account.message || "";
      userStore.signature = account.signature || "";
      await refreshBalance();
    } catch (err) {
      ElMessage.error("user reject connection");
      console.log("connect error", err);
    }
  };

  const signMessageAfterConnect = async () => {
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
      });
      await upWallet.signMessage("Hello World!");
      console.log("account", account);
      userStore.address = account.address;
      userStore.email = account.email || "";
      userStore.newborn = account.newborn || false;
      await refreshBalance();
    } catch (err: any) {
      ElMessage.error("user reject connection");
      console.error(err);
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
    if (!userStore.address) return;
    const balance = await provider.getBalance(userStore.address);
    myNativeTokenBalance.value = formatEther(balance);

    const tokenContract = new Contract(
      myChainConfig.value.usdc.contract,
      ERC20ABI,
      upWallet.getProvider()
    );
    if (!userStore.address) return;
    myTokenBalance.value = formatUnits(
      await tokenContract.balanceOf(userStore.address),
      myChainConfig.value.usdc.decimals
    );
    console.log(
      `native balance = ${myNativeTokenBalance.value} usdc balance = ${myTokenBalance.value}`
    );
  };

  const logout = async (deep = false) => {
    await upWallet.logout(deep);
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
      const ret = await verifyMessageSignature(
        message.value,
        sig.value,
        userStore.address,
        false,
        upWallet.getAuthProvider()
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

  const signTypedData = async () => {
    console.log("signTypedData");
    try {
      const resp = await upWallet.signTypedData(eip712DemoData);
      console.log("resp", resp);
      eip712Sig.value = resp;
    } catch (err: any) {
      ElMessage.error(err?.message || "signTypedData error");
      console.log("auth error", err?.message);
    }
  };

  const verifyTypedSig = async () => {
    try {
      const ret = await verifyTypedDataSignature(
        eip712DemoData as TypedData,
        eip712Sig.value,
        userStore.address,
        upWallet.getAuthProvider()
      );
      if (ret === true) {
        ElMessage.success("verify eip712 signature success");
      } else {
        ElMessage.error("verify eip712 signature failed");
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
    eip712Sig,
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
    connectAndAuth,
    signMessageAfterConnect,
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

    chainChange,

    CHAIN_CONFIGS,
  };
};
