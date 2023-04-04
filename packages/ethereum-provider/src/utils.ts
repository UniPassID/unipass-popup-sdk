import { ChainType, Environment } from '@unipasswallet/popup-types';
import { utils } from 'ethers';
import { RpcUrls } from './type';

// supported chain ids, do not change
// ethereum
export const ETHEREUM_MAINNET = 1;
export const ETHEREUM_GOERLI = 5;

// polygon
export const POLYGON_MAINNET = 137;
export const POLYGON_MUMBAI = 80001;

// bsc
export const BSC_MAINNET = 56;
export const BSC_TESTNET = 97;

// rangers
export const RANGERS_MAINNET = 2025;
export const RANGERS_ROBIN = 9527;

// scroll testnet only
export const SCROLL_TESTNET = 534354;

// arbitrum
export const ARBITRUM_TESTNET = 421613;
export const ARBITRUM_MAINNET = 42161;

// avax
export const AVALANCHE_TESTNET = 43113;
export const AVALANCHE_MAINNET = 43114;

// kcc
export const KCC_TESTNET = 322;
export const KCC_MAINNET = 321;

export const SUPPORTED_CHAIN_ID = [
  ETHEREUM_MAINNET,
  ETHEREUM_GOERLI,
  POLYGON_MAINNET,
  POLYGON_MUMBAI,
  BSC_MAINNET,
  BSC_TESTNET,
  RANGERS_MAINNET,
  RANGERS_ROBIN,
  SCROLL_TESTNET,
  ARBITRUM_TESTNET,
  ARBITRUM_MAINNET,
  AVALANCHE_TESTNET,
  AVALANCHE_MAINNET,
  KCC_TESTNET,
  KCC_MAINNET,
];

export const SUPPORTED_MAINNET_CHAIN_ID = [
  ETHEREUM_MAINNET,
  POLYGON_MAINNET,
  BSC_MAINNET,
  RANGERS_MAINNET,
  ARBITRUM_MAINNET,
  AVALANCHE_MAINNET,
  KCC_MAINNET,
];
export const SUPPORTED_TESTNET_CHAIN_ID = [
  ETHEREUM_GOERLI,
  POLYGON_MUMBAI,
  BSC_TESTNET,
  RANGERS_ROBIN,
  SCROLL_TESTNET,
  ARBITRUM_TESTNET,
  AVALANCHE_TESTNET,
  KCC_TESTNET,
];

export const getChainNameByChainId = (id: number | string): ChainType => {
  switch (Number(id)) {
    case ETHEREUM_MAINNET:
    case ETHEREUM_GOERLI:
      return 'eth';

    case POLYGON_MAINNET:
    case POLYGON_MUMBAI:
      return 'polygon';

    case BSC_MAINNET:
    case BSC_TESTNET:
      return 'bsc';

    case RANGERS_MAINNET:
    case RANGERS_ROBIN:
      return 'rangers';

    case SCROLL_TESTNET:
      return 'scroll';

    case ARBITRUM_TESTNET:
    case ARBITRUM_MAINNET:
      return 'arbitrum';

    case AVALANCHE_TESTNET:
    case AVALANCHE_MAINNET:
      return 'avalanche';
    case KCC_TESTNET:
    case KCC_MAINNET:
      return 'kcc';

    default:
      return 'polygon';
  }
};

export const getENVByChainId = (id: number | string): Environment => {
  switch (Number(id)) {
    case ETHEREUM_MAINNET:
    case POLYGON_MAINNET:
    case BSC_MAINNET:
    case RANGERS_MAINNET:
    case ARBITRUM_MAINNET:
    case AVALANCHE_MAINNET:
    case KCC_MAINNET:
      return 'prod';
    case ETHEREUM_GOERLI:
    case POLYGON_MUMBAI:
    case BSC_TESTNET:
    case RANGERS_ROBIN:
    case SCROLL_TESTNET:
    case ARBITRUM_TESTNET:
    case AVALANCHE_TESTNET:
    case KCC_TESTNET:
      return 'test';
    default:
      return 'test';
  }
};

export const getRPCByChainId = (
  id: number | string,
  rpcUrls?: RpcUrls
): string => {
  rpcUrls = rpcUrls || {};
  switch (Number(id)) {
    case ETHEREUM_MAINNET:
      return rpcUrls?.mainnet ?? 'https://node.wallet.unipass.id/eth-mainnet';
    case POLYGON_MAINNET:
      return (
        rpcUrls?.polygon ?? 'https://node.wallet.unipass.id/polygon-mainnet'
      );
    case BSC_MAINNET:
      return (
        rpcUrls?.bscMainnet ?? 'https://node.wallet.unipass.id/bsc-mainnet'
      );
    case RANGERS_MAINNET:
      return (
        rpcUrls?.rangersMainnet ??
        'https://node.wallet.unipass.id/rangers-mainnet'
      );
    case ARBITRUM_MAINNET:
      return (
        rpcUrls?.arbitrumMainnet ??
        'https://node.wallet.unipass.id/arbitrum-mainnet'
      );
    case AVALANCHE_MAINNET:
      return (
        rpcUrls?.avalancheMainnet ??
        'https://node.wallet.unipass.id/avalanche-mainnet'
      );
    case KCC_MAINNET:
      return (
        rpcUrls?.kccMainnet ?? 'https://node.wallet.unipass.id/kcc-mainnet'
      );
    case ETHEREUM_GOERLI:
      return rpcUrls?.goerli ?? 'https://node.wallet.unipass.id/eth-goerli';
    case POLYGON_MUMBAI:
      return (
        rpcUrls?.polygonMumbai ??
        'https://node.wallet.unipass.id/polygon-mumbai'
      );
    case BSC_TESTNET:
      return (
        rpcUrls?.bscTestnet ?? 'https://node.wallet.unipass.id/bsc-testnet'
      );
    case RANGERS_ROBIN:
      return (
        rpcUrls?.rangersRobin ?? 'https://node.wallet.unipass.id/rangers-robin'
      );
    case SCROLL_TESTNET:
      return (
        rpcUrls?.scrollTestnet ??
        'https://node.wallet.unipass.id/scroll-testnet'
      );
    case ARBITRUM_TESTNET:
      return (
        rpcUrls?.arbitrumTestnet ??
        'https://node.wallet.unipass.id/arbitrum-testnet'
      );
    case AVALANCHE_TESTNET:
      return (
        rpcUrls?.avalancheTestnet ??
        'https://node.wallet.unipass.id/avalanche-testnet'
      );
    case KCC_TESTNET:
      return (
        rpcUrls?.kccTestnet ?? 'https://node.wallet.unipass.id/kcc-testnet'
      );
    default:
      return 'https://node.wallet.unipass.id/polygon-mumbai';
  }
};

export const isCorrectChainId = (
  currentChainId: number,
  chainId: number
): boolean => {
  if (SUPPORTED_MAINNET_CHAIN_ID.includes(currentChainId)) {
    return SUPPORTED_MAINNET_CHAIN_ID.includes(chainId);
  }

  if (SUPPORTED_TESTNET_CHAIN_ID.includes(currentChainId)) {
    return SUPPORTED_TESTNET_CHAIN_ID.includes(chainId);
  }

  return false;
};

function convertHexToUtf8(value: string) {
  if (utils.isHexString(value)) {
    return utils.toUtf8String(value);
  }

  return value;
}

export function getSignParamsMessage(params: string[]) {
  const message = params.filter((p) => !utils.isAddress(p))[0];

  return convertHexToUtf8(message);
}

export function getSignTypedDataParamsData(params: string[]) {
  const data = params.filter((p) => !utils.isAddress(p))[0];

  if (typeof data === 'string') {
    return JSON.parse(data);
  }

  return data;
}
