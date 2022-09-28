
export type UPMessageType =
| 'UP_READY'
| 'UP_RESPONSE'
| 'UP_CLOSE'
| 'UP_SIGN_MESSAGE'
| 'UP_TRANSACTION'
| 'UP_LOGIN'
| 'UP_EVENT'
| 'UP_ERROR'

export class UPAccount {
constructor(
  public address: string,
  public email?: string,
  public newborn?: boolean,
) {}
}

// ---------- AUTHORIZE ----------

export enum UPEventType {
REGISTER = 'register',
}
export class UPEvent {
constructor(
  public readonly type: UPEventType,
  public readonly body: UPAccount,
) {}
}

export type UPEventListener = (event: UPEvent) => void

export interface Token {
address: string
symbol: string
decimals: number
}


export class UPAuthMessage {
constructor(
  public readonly from: string,
  public readonly msg: string,
) {}
}

export type Environment = "dev" | "test" | "prod";
export type ChainType = "polygon" | "bsc" | "rangers";

export class UPTransactionMessage {
  constructor(
    public readonly from: string,
    public readonly to: string,
    public readonly amount: string,
    public readonly data: string
  ) {}
}


type RESPONSE_TYPE = 'APPROVE' | 'DECLINE' | 'TransactionHash' | 'Signature'
export class UPResponse {
constructor(
  public readonly type: RESPONSE_TYPE,
  public readonly data: UPAccount | string,
) {}
}

// ------------ CONNECT ------------
export class UPMessage {
constructor(public type: UPMessageType, public payload?: string) {}
}

export enum UniPassTheme {
LIGHT = 'light',
DARK = 'dark',
}

export type UPChainInfo = {
id: number
name: string
}

export type UPConnectOptions = {
email?: boolean
evmKeys?: boolean
theme?: UniPassTheme
chain?: UPChainInfo
appName?: string
eventListener?: UPEventListener
}