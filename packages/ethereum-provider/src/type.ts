import { AppSettings } from '@unipasswallet/popup-types';

export interface RpcUrls {
  mainnet?: string;
  polygon?: string;
  bscMainnet?: string;
  rangersMainnet?: string;
  arbitrumMainnet?:string;
  goerli?: string;
  polygonMumbai?: string;
  bscTestnet?: string;
  rangersRobin?: string;
  scrollTestnet?: string;
  arbitrumTestnet?: string;
}

export interface UniPassProviderOptions {
  chainId: number;
  returnEmail: boolean;
  appSettings?: Omit<AppSettings, 'chain'>;
  rpcUrls?: RpcUrls;
}
