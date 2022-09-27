const UP_DOMAIN = 'wallet.unipass.id';

export type UP_CONFIG = {
  upDomain: string;
  upConnectUrl: string;
  upAuthUrl: string;
  upLoadingUrl: string;
};

export interface WalletURL {
  domain?: string;
  protocol?: 'https' | 'http';
}

var config: UP_CONFIG = {
  upDomain: UP_DOMAIN,
  upConnectUrl: `https://${UP_DOMAIN}/connect`,
  upAuthUrl: `https://${UP_DOMAIN}/authorize`,
  upLoadingUrl: `https://${UP_DOMAIN}/connect/loading`,
};

export default (option: WalletURL) => {
  let { domain, protocol } = option;

  domain = domain || UP_DOMAIN;
  protocol = protocol || 'https';

  config = {
    upDomain: domain,
    upConnectUrl: `${protocol}://${domain}/connect`,
    upAuthUrl: `${protocol}://${domain}/authorize`,
    upLoadingUrl: `${protocol}://${domain}/connect/loading`,
  };
  return config;
};

export const getConfig = () => config;

export enum ChainType {
  testnet = 0,
  mainnet = 1,
}

export interface PopupSDKConfig {
  rangersRPC: string; // Rangers Node RPC List
  chainType: ChainType; // Chain ID
}

// default testnet config
export const UP_TEST_CONFIG: PopupSDKConfig = {
  rangersRPC: 'https://node.wallet.unipass.id/rangers-robin',
  chainType: ChainType.testnet,
};

// default mainnet config
export const UP_MAIN_CONFIG: PopupSDKConfig = {
  rangersRPC: '',
  chainType: ChainType.mainnet,
};

// config options
export type PopupSDKOption = {
  readonly nodeRPC?: string; // Rangers Node RPC list
  readonly chainType?: ChainType; // Chain ID

  readonly upCoreConfig?: WalletURL; // UniPass up-core sdk configuration options

  readonly [key: string]: any; // other options
};
