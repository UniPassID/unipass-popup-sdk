import { UniPassPopupSDK } from '@unipasswallet/popup-sdk';
import { AppSettings } from '@unipasswallet/popup-types';
import { RequestArguments } from 'eip1193-provider';
import { providers } from 'ethers';
import {
  getChainNameByChainId,
  getENVByChainId,
  getRPCByChainId,
  getSignParamsMessage,
  getSignTypedDataParamsData,
} from './utils';

export class JsonRpcProvider {
  private appSetting?: Omit<AppSettings, 'chain'>;
  private returnEmail: boolean = false;
  public chainId: number;
  public http: providers.JsonRpcProvider;
  public readonly upWallet: UniPassPopupSDK;

  constructor(
    chainId: number,
    returnEmail: boolean,
    appSetting?: Omit<AppSettings, 'chain'>
  ) {
    this.appSetting = appSetting;
    this.returnEmail = returnEmail;
    this.chainId = chainId;

    this.upWallet = new UniPassPopupSDK({
      env: getENVByChainId(chainId),
      chainType: getChainNameByChainId(chainId),
      appSettings: {
        ...this.appSetting,
        chain: getChainNameByChainId(chainId),
      },
      storageType: 'sessionStorage',
    });

    this.http = new providers.JsonRpcProvider(getRPCByChainId(chainId));
  }

  public async connect() {
    const account = this.upWallet.getAccount();
    if (account) return account;
    return await this.upWallet.login({ email: this.returnEmail });
  }

  public async disconnect() {
    await this.upWallet.logout();
  }

  public async request(request: RequestArguments): Promise<any> {
    if (request.method.startsWith('eth_signTypedData')) {
      return await this.upWallet.signTypedData(
        getSignTypedDataParamsData(request.params as string[]),
        true
      );
    } else if (request.method === 'personal_sign') {
      return await this.upWallet.signMessage(
        getSignParamsMessage(request.params as string[]),
        true
      );
    } else if (request.method === 'eth_sendTransaction') {
      const _params =
        request?.params && Array.isArray(request?.params) && request?.params[0]
          ? request?.params[0]
          : undefined;
      if (_params) {
        return await this.upWallet.sendTransaction(_params);
      }
      throw new Error('eth_sendTransaction error');
    } else {
      return await this.http.send(
        request.method,
        (request.params || []) as Array<any>
      );
    }
  }

  public updateUpWalletConfig = (chainId: number) => {
    this.upWallet.updateConfig({
      chainType: getChainNameByChainId(chainId),
      appSettings: {
        chain: getChainNameByChainId(chainId),
      },
    });
    this.chainId = chainId;
    this.http = new providers.JsonRpcProvider(getRPCByChainId(chainId));
  };
}
