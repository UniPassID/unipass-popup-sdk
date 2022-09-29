// https://d.api.unipass.id/wallet/documentation/
import Axios from 'axios'
import { initResponse } from '@/service/backend-error'
import { CallType } from '@unipasswallet/transactions'
import { BigNumber, BytesLike } from 'ethers'

import { Transaction } from '@unipasswallet/transactions'

const axios = Axios.create({
  baseURL: process.env.VUE_APP_Backend,
  // timeout: 25000,
  // headers: {},
})

declare module 'axios' {
  interface AxiosResponse {
    ok: boolean
    statusCode: number
    // message?: string | any[]
    // error?: string
  }
}

// interceptors https://axios-http.com/zh/docs/interceptors
axios.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)
axios.interceptors.response.use(
  function (response) {
    return initResponse(response)
  },
  function (error) {
    return initResponse(error.response)
  },
)

// interface
export interface ApiResponse {
  ok: boolean
  statusCode: number
  // message?: string | any[]
  // error?: string
}
export type OtpAction =
  | 'bindPhone'
  | 'signUp'
  | 'signIn'
  | 'sendGuardian'
  | 'sendRecoveryEmail'
  | 'startRecoveryEmail'
  | 'passwordLogin'
  | 'auth2Fa'
  | 'tssGenerate'
  | 'tssSign'

// Send Otp Code
export interface SendOtpCodeInput {
  email: string
  action: OtpAction
  bindPhone?: {
    phone: string
    areaCode: string
  }
  authType: AuthType
}

// Verify Otp Code
export interface VerifyOtpCodeInput {
  email: string
  action: OtpAction
  code: string
  authType: AuthType
}
export interface VerifyOtpCodeOutput extends ApiResponse {
  data: {
    upAuthToken: string
  }
}

// register Get Guardian Token
export interface GetGuardianTokenOutput extends ApiResponse {
  data: [
    {
      verified: boolean
      email: string
    },
  ]
}

export interface GuardianData {
  email: string
  emailHash: string
  pepper: string
  isSelfGuardian: boolean
}

interface MasterKey {
  kdfPassword: string
  masterKeyAddress: string
  keyStore: string
}

// register Account
export interface SignUpAccountInput {
  email: string
  pepper: string
  upAuthToken: string
  keysetJson: string
  masterKey: MasterKey
  sessionKeyPermit: SessionKeyPermit | Record<string, never>
}
export interface SignUpAccountOutput extends ApiResponse {
  data: {
    address: string
    keysetHash: string
  }
}

// login
export interface GetPasswordTokenInput {
  // register email
  email: string
  kdfPassword: string
  // google captchaToken
  captchaToken: string
}
// login check password
export interface PasswordTokenOutput extends ApiResponse {
  data: {
    address: string
    pending: boolean
    upAuthToken: string
    showCaptcha: boolean
  }
}
// login get keystore
export interface LoginInput {
  email: string
  upAuthToken: string
  auth2FaToken: Auth2FaCodeToken[]
}
export interface LoginOutput extends ApiResponse {
  data: {
    address: string
    keystore: string
    localKeyAddress: string
    upAuthToken: string
  }
}
export interface SessionKeyPermit {
  timestamp: number
  timestampNow: number
  permit: string
  sessionKeyAddress: string
  sig: string
  weight: number
}
// login get keyset
export interface QueryAccountKeysetInput {
  email: string
  upAuthToken: string
  sessionKeyPermit: SessionKeyPermit | Record<string, never>
}
export interface QueryAccountKeysetOutput extends ApiResponse {
  data: {
    masterKeyAddress: string
    accountAddress: string
    keyset: string
  }
}
// recovery

export interface UploadRecoveryCloudKeyInput {
  email: string
  upAuthToken: string
  masterKey: MasterKey
  sessionKeyPermit: SessionKeyPermit
}
export interface UploadRecoveryCloudKeyOutput extends ApiResponse {
  data: {
    upAuthToken: string
  }
}
export interface SendRecoveryEmailInput {
  email: string
  upAuthToken: string
  // verificationEmail: string
  verificationEmailHash: string
  newMasterKeyAddress: string
}

export interface StartRecoveryInput {
  email: string
  // verificationEmail: string[]
  verificationEmailHashs: string[]
}
export interface QueryRecoveryOutput extends ApiResponse {
  data: {
    emailHash: string
    status: number
    transactionHash: string
  }[]
}
export interface SendGuardianLinkInput {
  email: string
  registerEmail: string
}
export interface SuffixesOutput extends ApiResponse {
  data: {
    suffixes: string[]
    policyAddress: string
    mainNetNodeList: string[]
    testNetNodeList: string[]
  }
}
export interface CancelRecoveryInput {
  email: string
  metaNonce: number
  signature: string
  transaction: {
    callType: CallType
    gasLimit: string
    target: BytesLike
    value: string
    data: BytesLike
  }
}
export interface TransactionHashOutput extends ApiResponse {
  data: {
    transactionHash: string
  }
}
export interface queryAccountKeystoreInput {
  email: string
  kdfPassword: string
  captchaToken: string
  sessionKeyPermit: SessionKeyPermit
}
export interface queryAccountKeystoreOutput extends ApiResponse {
  data: {
    address: string
    keystore: string
    showCaptcha: string
    localKeyAddress: string
    upAuthToken: string
  }
}
//--- tss input output ----
export interface StartKeyGenInput {
  email: string
  upAuthToken: string
  action: string
}
export interface KeygenData {
  userId: string
  sessionId: string
  msg: any
}
export interface TssOutput extends ApiResponse {
  data: {
    upAuthToken: string
    tssRes: KeygenData
    msg: any
  }
}
export interface KeyGenInput {
  email: string
  upAuthToken: string
  sessionId: string
  tssMsg: any
  action: string
}
export interface FinishKeygenInput {
  email: string
  upAuthToken: string
  sessionId: string
  userId: string
  localKeyAddress: string
  action: string
}
export interface StartSignInput {
  email: string
  upAuthToken: string
  localKeyAddress: string
  tssMsg: any
  value: string
  action: string
}
export interface SignInput {
  email: string
  sessionId: string
  upAuthToken: string
  tssMsg: any
  value: string
  action: string
}
// 2FA
// 0:Email | 1:Phone | 2:GoogleAuthenticator | 3:WebAuth
export type AuthType = 0 | 1 | 2 | 3

export interface GetGoogleAuthenticatorQRCodeInput {
  email: string
  sessionKeyPermit: {
    timestamp: number
    timestampNow: number
    permit: string
    sessionKeyAddress: string
    sig: string
  }
}
export interface GetGoogleAuthenticatorQRCodeOutput extends ApiResponse {
  data: {
    qrPath: string
    secret: string
  }
}
export interface AddAuthenticatorInput {
  email: string
  sessionKeyPermit: SessionKeyPermit
  type: AuthType
  value: string
  code: string
}
export interface AddAuthenticatorOutput extends ApiResponse {
  data: {
    status: number // 0:close 1:open
    bind: boolean
  }
}
export interface AuthenticatorStatusInput {
  email: string
  sessionKeyPermit: SessionKeyPermit
  type: number
  status: number
}
export interface AuthenticatorStatusOutput extends ApiResponse {
  data: {
    status: number // 2fa status 0:close,1:open
  }
}
export interface DeleteAuthenticatorInput {
  email: string
  sessionKeyPermit: SessionKeyPermit
  type: AuthType
}
export interface DeleteAuthenticatorOutput extends ApiResponse {
  data: {
    bind: SessionKeyPermit
  }
}
export interface AuthenticatorListInput {
  email: string
  showAllStatus?: boolean
}
export interface AuthenticatorListOutput extends ApiResponse {
  data: {
    type: AuthType
    value: string
    status: number
  }[]
}
export interface Auth2FaCodeToken {
  type: number
  upAuthToken: string
}

// update guardian
export interface CheckKeysetInput {
  email: string
  sessionKeyPermit: SessionKeyPermit
  keysetJson: string
  isAddGuradian: boolean
}
export interface UpdateGuardianInput {
  email: string
  upAuthToken: string
  sessionKeyPermit: SessionKeyPermit
  masterKeySig: string
}

//sync
export interface SendAuthEmailInput {
  email: string
  upAuthToken: string
  authChainNode: string
}
export interface GetTransactionInput {
  email: string
  sessionKeyPermit: SessionKeyPermit
  authChainNode: string
}

export interface SyncTx {
  isNeedDeploy: boolean
  transactions: Transaction[]
}
export interface GetTransactionOutPut extends ApiResponse {
  data: SyncTx
}

// Request
const api = {
  getConfig(): Promise<SuffixesOutput> {
    return axios({ method: 'get', url: '/api/v1/config' })
  },
  sendOtpCode(data: SendOtpCodeInput): Promise<ApiResponse> {
    return axios({ method: 'post', url: '/api/v1/otp/send', data })
  },
  verifyOtpCode(data: VerifyOtpCodeInput): Promise<VerifyOtpCodeOutput> {
    return axios({ method: 'post', url: '/api/v1/otp/verify', data })
  },

  // register
  signUpAccount(data: SignUpAccountInput): Promise<SignUpAccountOutput> {
    return axios({ method: 'post', url: '/api/v1/account/signup', data })
  },

  // login
  getPasswordToken(data: GetPasswordTokenInput): Promise<PasswordTokenOutput> {
    return axios({ method: 'post', url: '/api/v1/account/password.token', data })
  },
  login(data: LoginInput): Promise<LoginOutput> {
    return axios({ method: 'post', url: '/api/v1/account/signIn', data })
  },
  queryAccountKeyset(data: QueryAccountKeysetInput): Promise<QueryAccountKeysetOutput> {
    return axios({ method: 'post', url: '/api/v1/account/keyset', data })
  },
  queryAccountKeystore(data: queryAccountKeystoreInput): Promise<queryAccountKeystoreOutput> {
    return axios({ method: 'post', url: '/api/v1/account/keystore', data })
  },

  // recovery
  uploadRecoveryMasterKey(
    data: UploadRecoveryCloudKeyInput,
  ): Promise<UploadRecoveryCloudKeyOutput> {
    return axios({ method: 'post', url: '/api/v1/account/recovery/upload.key', data })
  },
  sendRecoveryEmail(data: SendRecoveryEmailInput): Promise<ApiResponse> {
    return axios({ method: 'post', url: '/api/v1/account/recovery/guardian.send.email', data })
  },

  startRecovery(data: StartRecoveryInput): Promise<QueryRecoveryOutput> {
    return axios({
      method: 'post',
      url: '/api/v1/account/recovery/start',
      data,
    })
  },
  sendRecoveryStatus(email: string): Promise<QueryRecoveryOutput> {
    return axios({
      method: 'post',
      url: '/api/v1/account/recovery/guardian.email.status',
      data: { email },
    })
  },
  cancelRecovery(data: CancelRecoveryInput): Promise<TransactionHashOutput> {
    return axios({ method: 'post', url: '/api/v1/account/recovery/cancel', data })
  },

  // tss
  startKeygen(data: StartKeyGenInput): Promise<TssOutput> {
    return axios({ method: 'post', url: '/api/v1/tss/keygen/start', data })
  },
  getKeygen(data: KeyGenInput): Promise<TssOutput> {
    return axios({ method: 'post', url: '/api/v1/tss/keygen', data })
  },
  finishKeygen(data: FinishKeygenInput): Promise<TssOutput> {
    return axios({ method: 'post', url: '/api/v1/tss/keygen/finish', data })
  },
  startSign(data: StartSignInput): Promise<TssOutput> {
    return axios({ method: 'post', url: '/api/v1/tss/sign/start', data })
  },
  sign(data: SignInput): Promise<TssOutput> {
    return axios({ method: 'post', url: '/api/v1/tss/sign', data })
  },

  // 2FA
  getGoogleAuthenticatorQRCode(
    data: GetGoogleAuthenticatorQRCodeInput,
  ): Promise<GetGoogleAuthenticatorQRCodeOutput> {
    return axios({ method: 'post', url: '/api/v1/2fa/ga/qrcode', data })
  },
  addAuthenticator(data: AddAuthenticatorInput): Promise<AddAuthenticatorOutput> {
    return axios({ method: 'post', url: '/api/v1/2fa/add', data })
  },
  authenticatorStatus(data: AuthenticatorStatusInput): Promise<AuthenticatorStatusOutput> {
    return axios({ method: 'post', url: '/api/v1/2fa/open.status', data })
  },
  deleteAuthenticator(data: DeleteAuthenticatorInput): Promise<DeleteAuthenticatorOutput> {
    return axios({ method: 'post', url: '/api/v1/2fa/del', data })
  },
  authenticatorList(data: AuthenticatorListInput): Promise<AuthenticatorListOutput> {
    return axios({ method: 'post', url: '/api/v1/2fa/list', data })
  },

  // guardian
  sendGuardianLink(data: SendGuardianLinkInput): Promise<ApiResponse> {
    return axios({ method: 'post', url: '/api/v1/account/guardian.link', data })
  },
  getGuardianToken(registerEmail: string): Promise<GetGuardianTokenOutput> {
    return axios({
      method: 'post',
      url: '/api/v1/account/guardian.status',
      data: { registerEmail },
    })
  },
  checkKeyset(checkKeysetInput: CheckKeysetInput): Promise<VerifyOtpCodeOutput> {
    return axios({
      method: 'post',
      url: '/api/v1/account/keyset.check',
      data: checkKeysetInput,
    })
  },
  updateGuardian(updateGuardianInput: UpdateGuardianInput): Promise<TransactionHashOutput> {
    return axios({
      method: 'post',
      url: '/api/v1/account/guardian.update',
      data: updateGuardianInput,
    })
  },

  // sync
  sendAuthEmail(data: SendAuthEmailInput): Promise<ApiResponse> {
    return axios({ method: 'post', url: '/api/v1/sync/send/auth.email', data })
  },
  getSyncTranscation(data: GetTransactionInput): Promise<GetTransactionOutPut> {
    const sss = axios({
      method: 'post',
      url: '/api/v1/sync/transaction',
      data,
    })
    sss.then((res) => console.log(JSON.stringify(res)))
    return sss
  },
}

export default api
