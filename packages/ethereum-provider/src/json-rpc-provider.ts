import { UniPassPopupSDK } from '@unipasswallet/popup-sdk';
import { AppSettings } from '@unipasswallet/popup-types';
import { RequestArguments } from 'eip1193-provider';
import { providers } from 'ethers';
import { Configurations, RpcUrls } from './type';
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
  private configurations: Configurations = { onAuthChain: true };
  private rpcUrls?: RpcUrls;
  public chainId: number;
  public http: providers.JsonRpcProvider;
  public readonly upWallet: UniPassPopupSDK;

  constructor(
    chainId: number,
    returnEmail: boolean,
    configurations?: Configurations,
    rpcUrls?: RpcUrls,
    appSetting?: Omit<AppSettings, 'chain'>
  ) {
    this.appSetting = appSetting;
    this.returnEmail = returnEmail;
    if (configurations) {
      this.configurations = { ...this.configurations, ...configurations };
    }
    this.chainId = chainId;
    this.rpcUrls = rpcUrls;

    const nodeRPC = getRPCByChainId(chainId, rpcUrls);

    this.upWallet = new UniPassPopupSDK({
      env: getENVByChainId(chainId),
      chainType: getChainNameByChainId(chainId),
      appSettings: {
        ...this.appSetting,
        chain: getChainNameByChainId(chainId),
      },
      nodeRPC,
      storageType: 'sessionStorage',
      walletUrl: this.configurations.walletUrl,
    });

    this.http = new providers.JsonRpcProvider(nodeRPC);
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
        { onAuthChain: this.configurations.onAuthChain }
      );
    } else if (request.method === 'personal_sign') {
      return await this.upWallet.signMessage(
        getSignParamsMessage(request.params as string[]),
        { isEIP191Prefix: true, onAuthChain: this.configurations.onAuthChain }
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
    const nodeRPC = getRPCByChainId(chainId, this.rpcUrls);
    this.upWallet.updateConfig({
      chainType: getChainNameByChainId(chainId),
      nodeRPC,
      appSettings: {
        chain: getChainNameByChainId(chainId),
      },
    });
    this.chainId = chainId;
    this.http = new providers.JsonRpcProvider(nodeRPC);
  };
}
