import {
  UPAuthMessage,
  UPAccount,
  UPConnectOptions,
  UPTransactionMessage,
} from '@unipasswallet/popup-types';
import config, {
  ChainType,
  PopupSDKConfig,
  PopupSDKOption,
  UP_MAIN_CONFIG,
  UP_TEST_CONFIG,
} from './config';
import { BytesLike } from 'ethers';
import { connect, disconnect } from './connect';
import { authorize } from './authorize';
import { hexlify, toUtf8Bytes } from 'ethers/lib/utils';
import { JsonRpcProvider } from '@ethersproject/providers';
import { sendTransaction } from './send-transaction';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export class UniPassPopupSDK {
  private _config: PopupSDKConfig | undefined;
  private _account: UPAccount | undefined;
  private _provider: JsonRpcProvider | undefined;
  private _initialized: boolean;


  constructor(options: PopupSDKOption) {
    this.initConfig(options);

    // if no upCoreConfig, up-core sdk will not initialized
    if (options.upCoreConfig) {
      config(options.upCoreConfig);
    }

    this._initialized = false;
  }

  /**
   * init configurations
   * @param options
   */
  private initConfig(options: PopupSDKOption) {
    this._config = {
      rangersRPC: '',
      chainType: ChainType.testnet,
    };

    this._config.chainType = options.chainType || ChainType.testnet;
    const defaultConfig =
      this._config.chainType === ChainType.testnet
        ? UP_TEST_CONFIG
        : UP_MAIN_CONFIG;

    this._config.rangersRPC = options.nodeRPC || defaultConfig.rangersRPC;
  }

  private getProviderUrl(chainId: number): string {
    const urls = [
      {
        chainId: 9527,
        url: 'https://node.wallet.unipass.id/rangers-robin'
      },
      {
        chainId: 2025,
        url: 'https://node.wallet.unipass.id/rangers-mainnet'
      }
    ]

    return urls.find(x => x.chainId === chainId)!.url;
  }

  /**
   * initialize Rangers with user's username and email
   */
  public async login(options?: UPConnectOptions): Promise<UPAccount> {
    this._account = await connect(options)

    let chainId = options?.chain?.id;
    if (!chainId) chainId = this._config?.chainType === ChainType.mainnet ? 2025 : 9527

    this._provider = new JsonRpcProvider(this.getProviderUrl(chainId))
    this._initialized = true;

    return this._account;
  }

  public async logout() {
    disconnect()
  }


  public getProvider(): JsonRpcProvider {
    return this._provider!;
  }

  private checkInitialized() {
    if (!this._initialized) {
      throw new Error(`UPRangers is not initialized`);
    }
  }


  /**
   * get UniPass user's asset contract address on rangers.
   *
   * @returns asset contract address
   */
  public getAddress(): string {
    this.checkInitialized();
    return this._account!.address;
  }

  /**
   * call user's asset contract to send eth to a specified account
   *
   * @param to the receiver's address
   * @param amount the send amount, unit: wei
   * @returns the send transaction hash
   */
  public async sendTransaction(
    _transaction: UPTransactionMessage
  ): Promise<string> {
    this.checkInitialized();
    return await sendTransaction(_transaction);
  }


  public async signMessage(message: BytesLike): Promise<string> {
    this.checkInitialized();
    if (typeof (message) === "string") { message = toUtf8Bytes(message); }

    return await authorize(new UPAuthMessage(this._account!.address, hexlify(message)))
  }

  /**
   * verify UniPass user signed message and sig on Rangers contract
   *
   * @param msg the message to be signed
   * @param authResp the signature response returned by UniPass
   * @returns boolean true: pass verification, false: failed verification
   */
  public async isValidSignature(
    _msg: string,
    _sig: string
  ): Promise<boolean> {

    this.checkInitialized()
    throw new Error('unimplemented')
  }
}
