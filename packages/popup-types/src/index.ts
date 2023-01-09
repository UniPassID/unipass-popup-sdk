export type Environment = 'test' | 'prod';
export type ChainType = 'polygon' | 'bsc' | 'rangers' | 'eth' | 'scroll' | 'arbitrum';

export type UPMessageType =
  | 'UP_READY'
  | 'UP_RESPONSE'
  | 'UP_CLOSE'
  | 'UP_SIGN_MESSAGE'
  | 'UP_TRANSACTION'
  | 'UP_LOGIN'
  | 'UP_EVENT'
  | 'UP_ERROR';

export class UPAccount {
  constructor(
    public address: string,
    public email?: string,
    public newborn?: boolean
  ) {}
}

// ---------- AUTHORIZE ----------

export enum UPEventType {
  REGISTER = 'register',
}
export class UPEvent {
  constructor(
    public readonly type: UPEventType,
    public readonly body: UPAccount
  ) {}
}

export type UPEventListener = (event: UPEvent) => void;

export class UPAuthMessage {
  constructor(
    public readonly from: string,
    public readonly msg: string,
    public readonly type?: 'V1' | 'V4'
  ) {}
}

export class UPTransactionMessage {
  constructor(
    public readonly from: string,
    public readonly to: string,
    public readonly value: string,
    public readonly data: string
  ) {}
}

type RESPONSE_TYPE = 'APPROVE' | 'DECLINE';
export class UPResponse {
  constructor(
    public readonly type: RESPONSE_TYPE,
    public readonly data: UPAccount | string
  ) {}
}

export type AppSettings = {
  chain?: ChainType;
  appName?: string;
  appIcon?: string;
  theme?: UniPassTheme;
};

export class UPMessage {
  constructor(
    public type: UPMessageType,
    public payload?: string,
    public appSetting?: AppSettings
  ) {}
}

// ------------ CONNECT ------------
export enum UniPassTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

export type ConnectType = 'google' | 'email' | 'both';

export type UPConnectOptions = {
  email?: boolean;
  connectType?: ConnectType;
  eventListener?: UPEventListener;
};

export interface MessageTypeProperty {
  name: string;
  type: string;
}

export interface MessageTypes {
  EIP712Domain: MessageTypeProperty[];
  [additionalProperties: string]: MessageTypeProperty[];
}

export interface TypedMessage<T extends MessageTypes> {
  types: T;
  primaryType: keyof T;
  domain: {
    name?: string;
    version?: string;
    chainId?: number;
    verifyingContract?: string;
    salt?: ArrayBuffer;
  };
  message: Record<string, unknown>;
}
