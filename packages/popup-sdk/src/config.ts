import { ChainType, Environment, AppSettings } from "@unipasswallet/popup-types";

const UP_DOMAIN = 'wallet.unipass.id';

export type UP_API_CONFIG = {
  upDomain: string;
  upConnectUrl: string;
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
  upSignMessageUrl: `https://${UP_DOMAIN}/send`,
  upTransactionUrl: `https://${UP_DOMAIN}/send`,
  upLoadingUrl: `https://${UP_DOMAIN}/connect/loading`,
};

export default (option: WalletURL) => {
  let { domain, protocol } = option;

  domain = domain || UP_DOMAIN;
  protocol = protocol || 'https';

  config = {
    upDomain: domain,
    upConnectUrl: `${protocol}://${domain}/connect`,
    upSignMessageUrl: `${protocol}://${domain}/send`,
    upTransactionUrl: `${protocol}://${domain}/send`,
    upLoadingUrl: `${protocol}://${domain}/connect/loading`,
  };
  return config;
};

export const getConfig = () => config;

export interface PopupSDKConfig {
  env: Environment;
  chainType: ChainType;
  nodeRPC: string;

  appSettings?: AppSettings;
}

// default testnet config
export const UP_TEST_CONFIG: PopupSDKConfig = {
  nodeRPC: 'https://node.wallet.unipass.id/polygon-mumbai',
  chainType: 'polygon',
  env: 'test',

};

// default mainnet config
export const UP_MAIN_CONFIG: PopupSDKConfig = {
  nodeRPC: 'https://node.wallet.unipass.id/polygon-mainnet',
  chainType: 'polygon',
  env: 'prod'
};

// config options
export type PopupSDKOption = {
  readonly nodeRPC?: string; // Rangers Node RPC list
  readonly chainType?: ChainType; // Chain ID
  readonly env?: Environment;

  readonly walletUrl?: WalletURL; // UniPass up-core sdk configuration options

  readonly appSettings?: AppSettings;

  readonly [key: string]: any; // other options
};
