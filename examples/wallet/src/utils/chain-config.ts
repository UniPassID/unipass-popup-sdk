import type { ChainType } from "@unipasswallet/popup-types";

type ChainConfig = {
  [key in ChainType]: {
    name: string;
    rpc: string;
    nativeToken: string;
    usdc: {
      contract: string;
      decimals: number;
    };
  };
};

export const TESTNET_CHAIN_OPTIONS = [
  {
    value: "eth",
    label: "Goerli (ChainID 5)",
  },
  {
    value: "polygon",
    label: "Mumbai (ChainID 80001)",
  },
  {
    value: "bsc",
    label: "BSC testnet (ChainID 97)",
  },
  {
    value: "rangers",
    label: "Rangers robin (ChainID 9527)",
  },
  {
    value: "scroll",
    label: "Scroll testnet (ChainID 534354)",
  },
  {
    value: "arbitrum",
    label: "Arbitrum testnet (ChainID 421613)",
  },
  {
    value: "avalanche",
    label: "Avalanche Fuji Testnet (ChainID 43113)",
  },
  {
    value: "kcc",
    label: "KCC testnet (ChainID 322)",
  },
  {
    value: "platon",
    label: "PlatON Testnet (ChainID 2206132)",
  },
  {
    value: "okc",
    label: "OKC Testnet (ChainID 65)",
  },
];

export const MAINNET_CHAIN_OPTIONS = [
  {
    value: "eth",
    label: "Ethereum (ChainID 1)",
  },
  {
    value: "polygon",
    label: "Polygon Mainnet (ChainID 137)",
  },
  {
    value: "bsc",
    label: "BSC Mainnet (ChainID 56)",
  },
  {
    value: "rangers",
    label: "Rangers Mainnet (ChainID 9527)",
  },
  {
    value: "scroll",
    label: "Scroll Mainnet (ChainID 2025)",
  },
  {
    value: "arbitrum",
    label: "Arbitrum Mainnet (ChainID 42161)",
  },
  {
    value: "avalanche",
    label: "Avalanche Fuji Mainnet (ChainID 43114)",
  },
  {
    value: "kcc",
    label: "KCC Mainnet (ChainID 321)",
  },
  {
    value: "platon",
    label: "PlatON Mainnet (ChainID 210425)",
  },
  {
    value: "okc",
    label: "OKC Mainnet (ChainID 66)",
  },
];

export const TESTNET_CHAIN_CONFIGS: ChainConfig = {
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
  arbitrum: {
    name: "Arbitrum-testnet",
    rpc: "https://node.wallet.unipass.id/arbitrum-testnet",
    nativeToken: "ETH",
    usdc: {
      contract: "0x8667Bfb67d4D9fd1e61168dc872e17f637964547",
      decimals: 6,
    },
  },
  scroll: {
    name: "Scroll-testnet",
    rpc: "https://node.wallet.unipass.id/scroll-testnet",
    nativeToken: "ETH",
    usdc: {
      contract: "0xA0D71B9877f44C744546D649147E3F1e70a93760",
      decimals: 18,
    },
  },
  kcc: {
    name: "Kcc-testnet",
    rpc: "https://node.wallet.unipass.id/kcc-testnet",
    nativeToken: "KCS",
    usdc: {
      contract: "0xd6c7e27a598714c2226404eb054e0c074c906fc9",
      decimals: 18,
    },
  },
  avalanche: {
    name: "Avalanche-testnet",
    rpc: "https://node.wallet.unipass.id/avalanche-testnet",
    nativeToken: "AVAX",
    usdc: {
      contract: "0x5425890298aed601595a70AB815c96711a31Bc65",
      decimals: 6,
    },
  },
  platon: {
    name: "PlatON-testnet",
    rpc: "https://node.wallet.unipass.id/platon-testnet",
    nativeToken: "LAT",
    usdc: {
      contract: "0xEd5e318045D33611E877C25F7aFE6e98e2c2933C",
      decimals: 6,
    },
  },
  okc: {
    name: "OKC-testnet",
    rpc: "https://node.wallet.unipass.id/okc-testnet",
    nativeToken: "OKT",
    usdc: {
      contract: "0x6b2b3F5a58c4C258f63b948566581787E45D651E",
      decimals: 6,
    },
  },
};

export const MAINNET_CHAIN_CONFIGS: ChainConfig = {
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
  arbitrum: {
    name: "Arbitrum-mainnet",
    rpc: "https://node.wallet.unipass.id/arbitrum-mainnet",
    nativeToken: "ETH",
    usdc: {
      contract: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      decimals: 6,
    },
  },
  scroll: {
    name: "Scroll-mainnet",
    rpc: "https://node.wallet.unipass.id/scroll-mainnet",
    nativeToken: "ETH",
    usdc: {
      contract: "0xA0D71B9877f44C744546D649147E3F1e70a93760",
      decimals: 18,
    },
  },
  kcc: {
    name: "Kcc-mainnet",
    rpc: "https://node.wallet.unipass.id/kcc-mainnet",
    nativeToken: "KCS",
    usdc: {
      contract: "0x980a5afef3d17ad98635f6c5aebcbaeded3c3430",
      decimals: 18,
    },
  },
  avalanche: {
    name: "Avalanche-mainnet",
    rpc: "https://node.wallet.unipass.id/avalanche-mainnet",
    nativeToken: "AVAX",
    usdc: {
      contract: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
      decimals: 6,
    },
  },
  platon: {
    name: "PlatON-mainnet",
    rpc: "https://node.wallet.unipass.id/platon-mainnet",
    nativeToken: "LAT",
    usdc: {
      contract: "0x81ECac0D6Be0550A00FF064a4f9dd2400585FE9c",
      decimals: 6,
    },
  },
  okc: {
    name: "OKC-mainnet",
    rpc: "https://node.wallet.unipass.id/okc-mainnet",
    nativeToken: "OKT",
    usdc: {
      contract: "0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85",
      decimals: 18,
    },
  },
};
