import { AppSettings } from '@unipasswallet/popup-types';

export interface UniPassProviderOptions {
  chainId: number
  appSettings?: Omit<AppSettings, 'chain'>;
}