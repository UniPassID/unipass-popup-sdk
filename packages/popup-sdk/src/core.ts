import {
  UPAuthMessage,
  UPAccount,
  UPConnectOptions,
  UPTransactionMessage,
  MessageTypes,
  TypedMessage,
} from '@unipasswallet/popup-types';
import { encodeTypedDataDigest, TypedData } from '@unipasswallet/popup-utils';
import config, { PopupSDKConfig, PopupSDKOption } from './config';
import { BytesLike, Contract } from 'ethers';
import { connect, disconnect, getLocalAccount } from './connect';
import { authorize } from './authorize';
import {
  hexlify,
  toUtf8Bytes,
  keccak256,
  Bytes,
  concat,
} from 'ethers/lib/utils';
import { JsonRpcProvider } from '@ethersproject/providers';
import { sendTransaction } from './send-transaction';
import { getAppSettings, getAuthProviderUrl, getDefaultConfigOption } from '.';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const EIP1271_SELECTOR = '0x1626ba7e';

export const unipassMessagePrefix = '\x18UniPass Signed Message:\n';

export function unipassHashMessage(message: Bytes | string): string {
  if (typeof message === 'string') {
    message = toUtf8Bytes(message);
  }
  return keccak256(
    concat([
      toUtf8Bytes(unipassMessagePrefix),
      toUtf8Bytes(String(message.length)),
      message,
    ])
  );
}

export class UniPassPopupSDK {
  private _config: PopupSDKConfig | undefined;
  private _account: UPAccount | undefined;
  private _provider: JsonRpcProvider | undefined;
  private _auth_provider: JsonRpcProvider | undefined;
  private _initialized: boolean;

  constructor(options: PopupSDKOption) {
    this._initialized = false;
    this.initConfig(options);
  }

  /**
   * init configurations
   * @param options
   */
  private initConfig(options: PopupSDKOption) {
    this._config = {
      env: 'prod',
      nodeRPC: '',
      chainType: 'polygon',
      storageType: 'sessionStorage',
    };

    this._config.env = options.env || 'prod';
    this._config.chainType = options.chainType || 'polygon';
    const defaultConfig = getDefaultConfigOption(
      this._config.env,
      this._config.chainType
    );

    this._config.nodeRPC = options.nodeRPC || defaultConfig.nodeRPC!;
    this._config.appSettings = getAppSettings(
      this._config.chainType,
      options.appSettings
    );

    this._provider = new JsonRpcProvider(this._config.nodeRPC);
    this._auth_provider = new JsonRpcProvider(
      getAuthProviderUrl(this._config.env)
    );

    const walletUrl = options.walletUrl || defaultConfig.walletUrl;
    if (walletUrl) {
      config(walletUrl);
    }

    this._config.storageType = options.storageType || 'sessionStorage';

    this._initialized = true;
  }

  public updateConfig(
    options: Pick<PopupSDKOption, 'chainType' | 'nodeRPC' | 'appSettings'>
  ) {
    if (!this._config) {
      return;
    }
    if (options.chainType) {
      this._config.chainType = options.chainType;
    }
    if (options.nodeRPC) {
      this._config.nodeRPC = options.nodeRPC;
      this._provider = new JsonRpcProvider(this._config.nodeRPC);
    }
    if (options.appSettings) {
      this._config.appSettings = options.appSettings;
    }
  }

  /**
   * initialize Rangers with user's username and email
   */
  public async login(options?: UPConnectOptions): Promise<UPAccount> {
    this._account = await connect(this._config!, options);
    return this._account;
  }

  public getAccount(): UPAccount | undefined {
    if (!this._initialized) {
      throw new Error(`UniPassPopupSDK is not initialized`);
    }
    if (!this._account) {
      this._account = getLocalAccount(this._config!.storageType);
    }

    return this._account;
  }

  public async logout() {
    disconnect();
    this._initialized = false;
    this._account = undefined;
  }

  public getProvider(): JsonRpcProvider {
    this.checkInitialized();
    return this._provider!;
  }

  private checkInitialized() {
    if (!this._initialized) {
      throw new Error(`UniPassPopupSDK is not initialized`);
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
    return await sendTransaction(_transaction, this._config!);
  }

  public async signMessage(message: BytesLike): Promise<string> {
    this.checkInitialized();
    if (typeof message === 'string') {
      message = toUtf8Bytes(message);
    }

    return await authorize(
      new UPAuthMessage(this._account!.address, hexlify(message)),
      this._config!
    );
  }

  /**
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
      _account!,
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

    const code = await contract.isValidSignature(
      unipassHashMessage(_msg),
      _sig
    );

    return code === EIP1271_SELECTOR;
  }

  /**
   *
   * * V4 is based on [EIP-712](https://eips.ethereum.org/EIPS/eip-712), and includes full support of
   * arrays and recursive data structures.
   *
   * @param data - The typed data to sign.
   * @returns The '0x'-prefixed hex encoded signature.
   */
  public async signTypedData<T extends MessageTypes>(data: TypedMessage<T>) {
    this.checkInitialized();
    if (data == null) {
      throw new Error('Missing data parameter');
    }

    return await authorize(
      new UPAuthMessage(this._account!.address, JSON.stringify(data), 'V4'),
      this._config!
    );
  }

  /**
   * Valid the address of the account that created the given EIP-712
   * signature. The version provided must match the version used to
   * create the signature.
   *
   * @param options._data - The typed data that was signed.
   * @param options._sig - The '0x-prefixed hex encoded message signature.
   * @param options._account - The address of user.
   * @returns boolean true: pass verification, false: failed verification.
   */
  public async isValidTypedSignature<T extends MessageTypes>(
    _data: TypedMessage<T>,
    _account: string,
    _sig: string
  ) {
    if (_data == null) {
      throw new Error('Missing data parameter');
    }
    if (!_account) {
      this.checkInitialized();
      _account = this._account!.address;
    }
    const contract = new Contract(
      _account!,
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
    const messageHash = encodeTypedDataDigest(_data as TypedData);
    const code = await contract.isValidSignature(messageHash, _sig);

    return code === EIP1271_SELECTOR;
  }
}
