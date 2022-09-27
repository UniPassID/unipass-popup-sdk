import {
  Token,
  UPAuthMessage,
  UPAccount,
  UPConnectOptions
} from '@unipasswallet/popup-types';
import config, {
  ChainType,
  PopupSDKConfig,
  PopupSDKOption,
  UP_MAIN_CONFIG,
  UP_TEST_CONFIG,
} from './config';
import { BigNumber, BytesLike, Transaction } from 'ethers';
import { connect, disconnect } from './connect';
import { authorize } from './authorize';
import { hexlify, toUtf8Bytes } from 'ethers/lib/utils';
import { JsonRpcProvider } from '@ethersproject/providers';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export interface TxFeeOption {
  feeToken: Token;
  feeAmount: BigNumber;
}

const DEFAULT_FEE_OPTION: TxFeeOption = {
  feeToken: {
    address: ZERO_ADDRESS,
    symbol: 'RPG',
    decimals: 18,
  },
  feeAmount: BigNumber.from('1'),
};

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

  /**
   * initialize Rangers with user's username and email
   */
  public async login(options?: UPConnectOptions): Promise<UPAccount> {
    this._account = await connect(options)
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
    _transaction: Pick<Transaction, "to" | "value" | "data">,
    feeOption?: TxFeeOption
  ): Promise<string> {
    this.checkInitialized();
    if (!feeOption) {
      feeOption = DEFAULT_FEE_OPTION;
    }
    // const { feeToken, feeAmount, description } = feeOption;

    // TODO: send transaction to unipass
    throw new Error("unimplemented")

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
