import {
  UPAuthMessage,
  UPAccount,
  UPConnectOptions,
  UPTransactionMessage,
} from '@unipasswallet/popup-types';
import config, {
  PopupSDKConfig,
  PopupSDKOption,
  UP_MAIN_CONFIG,
  UP_TEST_CONFIG,
} from './config';
import { BytesLike, Contract } from 'ethers';
import { connect, disconnect } from './connect';
import { authorize } from './authorize';
import { hexlify, toUtf8Bytes, keccak256 } from 'ethers/lib/utils';
import { JsonRpcProvider } from '@ethersproject/providers';
import { sendTransaction } from './send-transaction';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const EIP1271_SELECTOR = '0x1626ba7e';
export class UniPassPopupSDK {
  private _config: PopupSDKConfig | undefined;
  private _account: UPAccount | undefined;
  private _provider: JsonRpcProvider | undefined;
  private _auth_provider: JsonRpcProvider | undefined;
  private _initialized: boolean;

  constructor(options: PopupSDKOption) {
    this.initConfig(options);

    // if no upCoreConfig, up-core sdk will not initialized
    if (options.walletUrl) {
      config(options.walletUrl);
    }

    this._initialized = false;
  }

  /**
   * init configurations
   * @param options
   */
  private initConfig(options: PopupSDKOption) {
    this._config = {
      env: 'prod',
      nodeRPC: 'https://node.wallet.unipass.id/polygon-mainnet',
      chainType: 'polygon',
    };

    this._config.chainType = options.chainType || 'polygon';
    const defaultConfig =
      options.env === 'prod' ? UP_MAIN_CONFIG : UP_TEST_CONFIG;

    this._auth_provider = new JsonRpcProvider(defaultConfig.nodeRPC);

    this._config.nodeRPC = options.nodeRPC || defaultConfig.nodeRPC;

    this._config.appSettings = options.appSettings || { appName: 'MyDemo' };
  }

  public updateConfig(options: PopupSDKOption) {
    if (!this._config) {
      return;
    }
    if (options.chainType) {
      this._config.chainType = options.chainType;
    }
    if (options.nodeRPC) {
      this._config.nodeRPC = options.nodeRPC;
    }
    if (options.appSettings) {
      this._config.appSettings = options.appSettings;
    }
  }

  /**
   * initialize Rangers with user's username and email
   */
  public async login(options?: UPConnectOptions): Promise<UPAccount> {
    this._account = await connect(options, this._config?.appSettings);

    this._provider = new JsonRpcProvider(this._config?.nodeRPC);
    this._initialized = true;

    return this._account;
  }

  public async logout() {
    disconnect();
  }

  public getProvider(): JsonRpcProvider {
    this.checkInitialized();
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
    return await sendTransaction(_transaction, this._config?.appSettings);
  }

  public async signMessage(message: BytesLike): Promise<string> {
    this.checkInitialized();
    if (typeof message === 'string') {
      message = toUtf8Bytes(message);
    }

    return await authorize(
      new UPAuthMessage(this._account!.address, hexlify(message)),
      this._config?.appSettings
    );
  }

  /**
   * verify UniPass user signed message and sig on Rangers contract
   *
   * @param msg the message to be signed
   * @param sig the signature response returned by UniPass
   * @param account the account who signed the message
   * @returns boolean true: pass verification, false: failed verification
   */
  public async isValidSignature(
    _msg: string,
    _sig: string,
    _account?: string
  ): Promise<boolean> {
    if (!_account) {
      this.checkInitialized();
      _account = this._account!.address;
    }
    const contract = new Contract(
      this._account!.address,
      [
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: '_hash',
              type: 'bytes32',
            },
            {
              internalType: 'bytes',
              name: '_signature',
              type: 'bytes',
            },
          ],
          name: 'isValidSignature',
          outputs: [
            {
              internalType: 'bytes4',
              name: 'magicValue',
              type: 'bytes4',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      this._auth_provider
    );
    const hash = keccak256(toUtf8Bytes(_msg));
    const code = await contract.isValidSignature(hash, _sig);

    return code === EIP1271_SELECTOR;
  }
}
