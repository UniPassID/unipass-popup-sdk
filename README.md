Popup-SDK is a javascript SDK for web-based applications. The basic UX will be just like MetaMask as there will be a popup window for users to inspect transactions and take actions.

We have an [online example](https://popup-demo.wallet.unipass.id/) for demostration, and its source is [here](https://github.com/UniPassID/unipass-popup-sdk/tree/main/examples/demo). 


# **Installation**

```bash
# install via npm
npm install --save @unipasswallet/popup-sdk

# install via yarn
yarn add @unipasswallet/popup-sdk
```

# **API**

### 1. **I**nitialization

- Create an `UniPassPopupSDK` instance with a `PopupSDKOption` object to customize. This is the definition of `PopupSDKOption`:

```tsx
export declare type Environment =  'test' | 'prod';
export declare type ChainType = 'polygon' | 'bsc' | 'rangers';

// UniPass Wallet entry URL
export interface WalletURL {
  domain?: string;
  protocol?: 'https' | 'http';
}

// Basic Theme
export declare enum UniPassTheme {
  LIGHT = "light",
  DARK = "dark"
}

// Config before open the popup window
export declare type AppSettings = {
  chain?: ChainType;
  appName?: string;
  appIcon?: string;
  theme?: UniPassTheme;
};

// UniPass Wallet init config
export declare type PopupSDKOption = {
  readonly nodeRPC?: string;
  readonly chainType?: ChainType;
  readonly env?: Environment;
  readonly walletUrl?: WalletURL;
  readonly appSettings?: AppSettings;
  readonly [key: string]: any;
};
```

- Code sample

```tsx
const upWallet = new UniPassPopupSDK({
  env: "test",

	// for polygon mumbai
	chainType: "polygon",
  nodeRPC: "https://node.wallet.unipass.id/polygon-mumbai",
	
	// for bsc testnet
	// chainType: "bsc",
  // nodeRPC: "https://node.wallet.unipass.id/bsc-testnet",

	// for rangers robin
  // chainType: "rangers",
  // nodeRPC: "https://node.wallet.unipass.id/rangers-robin",

  appSettings: {
    chain: "polygon",
    theme: toTheme.value as UniPassTheme,
    appName: "UniPass Wallet Demo",
    appIcon: "",
  },
  walletUrl: {
    domain: "https://testnet.wallet.unipass.id",
    protocol: "https",
  },
});
```

### **2. Connect UniPass Wallet and Request Ethereum Address**

```tsx
export declare type UPEventListener = (event: UPEvent) => void;
export declare type UPConnectOptions = {
    email?: boolean;                 // request email or not
		eventListener?: UPEventListener; // event listener during connection
};
```

- Return an `UPAccount` object if succeed. Otherwise an exception will be thrown if user denied the connection request.

```tsx
export declare class UPAccount {
    address: string;                       // Ethereum address of user
    email?: string | undefined;
    newborn?: boolean | undefined;         // Newly registered or not
    constructor(username: string, email?: string | undefined, newborn?: boolean | undefined);
}
```

`newborn` can be used to track new registration count.

- Code sample

```tsx
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
	const { address, email } = account;
  console.log("account", address, email);
  
} catch (err) {
  console.log("connect err", err);
}
```

### ****3. Send Transaction****

Type definitions:

```tsx
export declare class UPTransactionMessage {
  readonly from: string;
  readonly to: string;
  readonly value: string;
  readonly data: string;
  constructor(from: string, to: string, value: string, data: string);
}

export declare class UniPassPopupSDK {
  /**
   * call user's contract to send transaction
   *
   * @param _transaction transaction object
   * @returns the transaction hash
   */
  sendTransaction(_transaction: UPTransactionMessage): Promise<string>;

	 /**
   * sign message with UniPass Wallet, it is compatible with EIP-1271
   *
   * @param message message to be signed
   * @returns signature
   */
  signMessage(message: BytesLike): Promise<string>;

  /**
   * verify UniPass Wallet signed message and sig on user's contract
   *
   * @param _msg the message to be signed
   * @param _sig the signature response returned by UniPass
   * @returns boolean true: pass verification, false: failed verification
   */
  isValidSignature(_msg: string, _sig: string): Promise<boolean>;
}
```

**3.1 Transfer Native Token**

```tsx
async sendNativeToken() {
  try {
    const tx = {
      from: fromAddress,
      to: toAddress,
      value: parseEther(toAmount).toHexString(),
      data: "0x",
    };
    txHash.value = await upWallet.sendTransaction(tx);
    if (await checkTxStatus(txHash)) {
      console.log("send Native Token success", txHash);
    } else {
      console.error(`send Native Token failed, tx hash = ${txHash}`);
    }
  } catch (err) {
    console.log("err", err);
  }
}
```

**3.2 Transfer ERC20 Token**

```tsx
async sendToken() {   
  try {
		const tokenAddress = '0x25c58Aa062Efb4f069bD013De3e3C5797fb40651';
		const data = new utils.Interface(['function transfer(address _to, uint256 _value)']).encodeFunctionData('transfer', [toAddress, amount]);
    const tx = {
      from: fromAddress,
      to: tokenAddress,
      value: "0x0";,
      data: data,
    };
    txHash.value = await upWallet.sendTransaction(tx);
    if (await checkTxStatus(txHash)) {
      console.log("send Token success", txHash);
    } else {
      console.error(`send Token failed, tx hash = ${txHash}`);
    }
  } catch (err) {
    console.log("err", err);
  }
}
```

**3.3 Call contract**

Similar with transferring ERC20 token. First construct the call data, and then invoke `sendTransaction`.

### 4. **Sign and Verify**

**4.1 Sign message**

```tsx
const signMessage = async () => {
  try {
    const sig = await upWallet.signMessage(message);
  } catch (err) {
    console.log("auth err", err);
  }
}
```

**4.2 Verify message**

```tsx
const verifySig = async () => {
  const message = 'hello world';
  const sig: string;
  try {
    const ret = await upWallet.isValidSignature(message.value, sig.value, accountAddress);
    if (ret === true) {
      console.success("verify signature success");
    } else {
      console.error("verify signature failed");
    }
  } catch (err) {
    console.log("auth err", err);
  }
}
```

### 5. signTypedData(EIP712) and isValidTypedSignature

**5.1 EIP712 Type definitions**

```tsx
export interface MessageTypeProperty {
    name: string;
    type: string;
}
export interface MessageTypes {
    EIP712Domain: MessageTypeProperty[];
    [additionalProperties: string]: MessageTypeProperty[];
}

/**
 * This is the message format used for `signTypeData`, for all versions
 * except `V1`.
 *
 * @template T - The custom types used by this message.
 * @property types - The custom types used by this message.
 * @property primaryType - The type of the message.
 * @property domain - Signing domain metadata. The signing domain is the intended context for the
 * signature (e.g. the dapp, protocol, etc. that it's intended for). This data is used to
 * construct the domain seperator of the message.
 * @property domain.name - The name of the signing domain.
 * @property domain.version - The current major version of the signing domain.
 * @property domain.chainId - The chain ID of the signing domain.
 * @property domain.verifyingContract - The address of the contract that can verify the signature.
 * @property domain.salt - A disambiguating salt for the protocol.
 * @property message - The message to be signed.
 */
export interface TypedMessage<T extends MessageTypes> {
    types: T;
    primaryType: keyof T;
    domain: {
        name?: string;
        version?: string;
        chainId?: number;
        verifyingContract?: string;
        salt?: ArrayBuffer;
    };
    message: Record<string, unknown>;
}
```

**5.2 Sign Typed Data**

```tsx
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
```

**5.3 verifyTypedSig**

```tsx
const verifyTypedSig = async () => {
    try {
      const ret = await upWallet.isValidTypedSignature(
        eip712DemoData,
        address,
        eip712Sig
      );
      if (ret === true) {
        console.log("verify eip712 signature success");
      } else {
        console.log("verify eip712 signature failed");
      }
    } catch (err: any) {
      console.log("auth error", err?.message);
    }
  };
```

### 6. Logout

```tsx
await upWallet.logout()
```