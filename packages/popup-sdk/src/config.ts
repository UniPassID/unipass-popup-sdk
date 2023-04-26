import {
  AppSettings,
  ChainType,
  Environment,
  WindowSettings,
  WindowType,
} from '@unipasswallet/popup-types';

const UP_DOMAIN = 'wallet.unipass.id';

export type UP_API_CONFIG = {
  upDomain: string;
  upConnectUrl: string;
  upLogoutUrl: string;
  upSignMessageUrl: string;
  upTransactionUrl: string;
  upLoadingUrl: string;
};

export interface WalletURL {
  domain?: string;
  protocol?: 'https' | 'http';
}

var config: UP_API_CONFIG = {
  upDomain: UP_DOMAIN,
  upConnectUrl: `https://${UP_DOMAIN}/connect`,
  upLogoutUrl: `https://${UP_DOMAIN}/logout`,
  upSignMessageUrl: `https://${UP_DOMAIN}/sign-message`,
  upTransactionUrl: `https://${UP_DOMAIN}/send-transaction`,
  upLoadingUrl: `https://${UP_DOMAIN}/connect/loading`,
};

export default (option: WalletURL) => {
  let { domain, protocol } = option;

  domain = domain || UP_DOMAIN;
  protocol = protocol || 'https';

  config = {
    upDomain: domain,
    upConnectUrl: `${protocol}://${domain}/connect`,
    upLogoutUrl: `${protocol}://${domain}/logout`,
    upSignMessageUrl: `${protocol}://${domain}/sign-message`,
    upTransactionUrl: `${protocol}://${domain}/send-transaction`,
    upLoadingUrl: `${protocol}://${domain}/connect/loading`,
  };
  return config;
};

export const getConfig = () => config;

export type StorageType = 'sessionStorage' | 'localStorage';

export interface PopupSDKConfig {
  env: Environment;
  chainType: ChainType;
  nodeRPC: string;
  storageType: StorageType;
  windowType: WindowType;
  windowSettings?: WindowSettings;
  appSettings?: AppSettings;
}

const TEST_WALLET_URL: WalletURL = {
  protocol: 'https',
  domain: 'testnet.wallet.unipass.id',
};
const MAIN_WALLET_URL: WalletURL = {
  protocol: 'https',
  domain: 'wallet.unipass.id',
};

const NODE_RPC_LIST = {
  mainnet: {
    eth: 'https://node.wallet.unipass.id/eth-mainnet',
    polygon: 'https://node.wallet.unipass.id/polygon-mainnet',
    bsc: 'https://node.wallet.unipass.id/bsc-mainnet',
    rangers: 'https://node.wallet.unipass.id/rangers-mainnet',
    scroll: 'https://node.wallet.unipass.id/scroll-mainnet',
    arbitrum: 'https://node.wallet.unipass.id/arbitrum-mainnet',
  },
  testnet: {
    eth: 'https://node.wallet.unipass.id/eth-goerli',
    polygon: 'https://node.wallet.unipass.id/polygon-mumbai',
    bsc: 'https://node.wallet.unipass.id/bsc-testnet',
    rangers: 'https://node.wallet.unipass.id/rangers-robin',
    scroll: 'https://node.wallet.unipass.id/scroll-testnet',
    arbitrum: 'https://node.wallet.unipass.id/arbitrum-testnet',
  },
};

export const getDefaultConfigOption = (
  env: Environment,
  chainType: ChainType
): PopupSDKOption => {
  return {
    env,
    nodeRPC:
      env === 'prod'
        ? NODE_RPC_LIST.mainnet[chainType]
        : NODE_RPC_LIST.testnet[chainType],
    chainType,
    walletUrl: env === 'prod' ? MAIN_WALLET_URL : TEST_WALLET_URL,
  };
};

export const getAppSettings = (
  chainType: ChainType,
  settings?: AppSettings
): AppSettings => {
  const chain = settings?.chain || chainType;
  const appName = settings?.appName || 'MyDemo';
  const _settings = settings || {};
  return { ..._settings, chain, appName };
};

export const getAuthProviderUrl = (env: Environment): string => {
  return env === 'prod'
    ? NODE_RPC_LIST.mainnet.polygon
    : NODE_RPC_LIST.testnet.polygon;
};

// config options
export type PopupSDKOption = {
  readonly nodeRPC?: string; // Rangers Node RPC list
  readonly chainType?: ChainType; // Chain ID
  readonly env?: Environment;

  readonly storageType?: StorageType;
  readonly windowType?: WindowType;
  readonly windowSettings?: WindowSettings;
  readonly walletUrl?: WalletURL; // UniPass up-core sdk configuration options

  readonly appSettings?: AppSettings;

  readonly [key: string]: any; // other options
};
