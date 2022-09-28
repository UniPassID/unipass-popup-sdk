import Axios from 'axios'
import { CallType } from '@unipasswallet/transactions'
import { BytesLike } from 'ethers'
import { ApiResponse } from './backend'
import { initRelayerResponse } from './relayer-error'

const axios = Axios.create({
  baseURL: process.env.VUE_APP_Relayer,
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
    return initRelayerResponse(response)
  },
  function (error) {
    return initRelayerResponse(error.response)
  },
)
export interface AssetTransactionInput {
  nonce: number
  address: string
  params: any[]
}
export interface RelayerTransaction {
  callType: CallType
  gasLimit: string
  target: BytesLike
  value: string
  data: BytesLike
}
export interface ExecuteCallBody {
  chainId: string
  call: string
  walletAddress: string
  estimateGas: string
  txHash: string
}

export interface TxReceipt {
  txHash: string
  status: string
}

export interface ReceiptData extends ApiResponse {
  data: TxReceipt
}

export interface AssetData extends ApiResponse {
  data: string
}
// Request
const relayerApi = {
  asset(data: ExecuteCallBody): Promise<AssetData> {
    return axios({ method: 'post', url: '/send_transaction', data })
  },

  async getTxReceipt(txHash: string): Promise<ReceiptData> {
    return axios({ method: 'get', url: `/tx_receipt/${txHash}` })
  },
}

export default relayerApi
