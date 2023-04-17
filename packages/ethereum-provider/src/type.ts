import { AppSettings } from '@unipasswallet/popup-types';

export interface RpcUrls {
  mainnet?: string;
  polygon?: string;
  bscMainnet?: string;
  rangersMainnet?: string;
  arbitrumMainnet?: string;
  avalancheMainnet?: string;
  kccMainnet?: string;
  platonMainnet?: string;
  okcMainnet?: string;
  goerli?: string;
  polygonMumbai?: string;
  bscTestnet?: string;
  rangersRobin?: string;
  scrollTestnet?: string;
  arbitrumTestnet?: string;
  avalancheTestnet?: string;
  kccTestnet?: string;
  platonTestnet?: string;
  okcTestnet?: string;
}

export interface UniPassProviderOptions {
  chainId: number;
  returnEmail: boolean;
  appSettings?: Omit<AppSettings, 'chain'>;
  rpcUrls?: RpcUrls;
}
