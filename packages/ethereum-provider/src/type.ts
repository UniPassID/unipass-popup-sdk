import { AppSettings } from '@unipasswallet/popup-types';

export interface UniPassProviderOptions {
  chainId: number;
  returnEmail: boolean;
  appSettings?: Omit<AppSettings, 'chain'>;
}
