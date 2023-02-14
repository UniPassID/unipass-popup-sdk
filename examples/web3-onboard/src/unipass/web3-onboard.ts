import { UniPassTheme } from "@unipasswallet/popup-types";
import { init } from "@web3-onboard/react";
import unipassModule from ".";

import icon from "./blocknative";

const unipass = unipassModule({
  chainId: 42161,
  returnEmail: true,
  appSettings: {
    appName: "web3-onboard test for unipass",
    theme: UniPassTheme.DARK,
  },
  rpcUrls: {
    mainnet: "https://node.wallet.unipass.id/eth-mainnet",
    polygon:
      "https://polygon-mainnet.infura.io/v3/5356162b7e79435cbabea8756d548aab",
    bscMainnet: "https://node.wallet.unipass.id/bsc-mainnet",
    rangersMainnet: "https://node.wallet.unipass.id/rangers-mainnet",
    arbitrumMainnet: "https://node.wallet.unipass.id/arbitrum-mainnet",
  },
});

export default init({
  // An array of wallet modules that you would like to be presented to the user to select from when connecting a wallet.
  wallets: [unipass],
  // An array of Chains that your app supports
  chains: [
    {
      // hex encoded string, eg '0x1' for Ethereum Mainnet
      id: "0x1",
      // string indicating chain namespace. Defaults to 'evm' but will allow other chain namespaces in the future
      namespace: "evm",
      // the native token symbol, eg ETH, BNB, MATIC
      token: "ETH",
      // used for display, eg Ethereum Mainnet
      label: "Ethereum Mainnet",
      // used for network requests
      rpcUrl: `https://node.wallet.unipass.id/eth-mainnet`,
    },
    {
      id: "0x5",
      token: "GETH",
      label: "Ethereum Goerli",
      rpcUrl: `https://node.wallet.unipass.id/eth-goerli`,
    },
    {
      id: "0x89",
      token: "MATIC",
      label: "Matic Mainnet",
      rpcUrl:
        "https://polygon-mainnet.infura.io/v3/5356162b7e79435cbabea8756d548aab",
    },
    {
      id: "0x13881",
      token: "MATIC",
      label: "Matic Mumbai",
      rpcUrl: "https://node.wallet.unipass.id/polygon-mumbai",
    },
  ],
  appMetadata: {
    // The name of your dApp
    name: "Blocknative",
    // SVG icon string, with height or width (whichever is larger) set to 100% or a valid image URL
    icon,
    // Optional wide format logo (ie icon and text) to be displayed in the sidebar of connect modal. Defaults to icon if not provided
    logo: "<svg></svg>",
    // The description of your app
    description: "Demo app for Onboard V2",
    // The url to a getting started guide for app
    gettingStartedGuide: "http://mydapp.io/getting-started",
    // url that points to more information about app
    explore: "http://mydapp.io/about",
    // if your app only supports injected wallets and when no injected wallets detected, recommend the user to install some
    recommendedInjectedWallets: [
      {
        // display name
        name: "MetaMask",
        // link to download wallet
        url: "https://metamask.io",
      },
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
    ],
    // Optional - but allows for dapps to require users to agree to TOS and privacy policy before connecting a wallet
    agreement: {
      version: "1.0.0",
      termsUrl: "https://www.blocknative.com/terms-conditions",
      privacyUrl: "https://www.blocknative.com/privacy-policy",
    },
  },
});
