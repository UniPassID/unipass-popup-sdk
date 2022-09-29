export type Environment = 'dev' | 'test' | 'prod';
export type ChainType = 'polygon' | 'bsc' | 'rangers';

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
  constructor(public readonly from: string, public readonly msg: string) {}
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

export type UPConnectOptions = {
  email?: boolean;
  eventListener?: UPEventListener;
};
