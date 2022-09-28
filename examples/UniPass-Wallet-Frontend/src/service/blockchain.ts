import { Contract, providers, utils } from 'ethers'
import { getWalletAddress } from '@unipasswallet/utils'
import { moduleMain } from '@unipasswallet/abi'
import { unipassWalletContext } from '@unipasswallet/network'
import { CreationCode } from '@unipasswallet/utils'

let provider: providers.JsonRpcProvider
let moduleMainContract: Contract

export const MainModuleAddress = unipassWalletContext.moduleMain
export const DkimKeysAddress = unipassWalletContext.dkimKeys || ''
export const ProxyContractCode = CreationCode

export const EthContractAddress = CreationCode

const initProvider = () => {
  if (!provider) {
    provider = new providers.JsonRpcProvider(process.env.VUE_APP_Polygon_RPC)
    moduleMainContract = new Contract(MainModuleAddress, moduleMain.abi, provider)
  }
}

export interface IPendingStatus {
  isPending: boolean
  newKeysetHash: string
  timestamp: number
}

const blockchain = {
  getProvider(): providers.JsonRpcProvider {
    provider = new providers.JsonRpcProvider(process.env.VUE_APP_Polygon_RPC)
    return provider
  },
  async isRegistered(address: string) {
    initProvider()
    const code = await provider.getCode(address)
    return code !== '0x'
  },

  async getMetaNonce(address: string) {
    initProvider()
    const proxyModuleMainContract = moduleMainContract.attach(address)
    let metaNonce = 0

    try {
      metaNonce = await proxyModuleMainContract.getMetaNonce()
    } catch (error) {
      //
    }

    return Number(metaNonce.toString()) + 1
  },

  async getContract(address: string): Promise<Contract> {
    initProvider()
    const proxyModuleMainContract = moduleMainContract.attach(address)
    return proxyModuleMainContract
  },

  async getAccountKeysetHash(address: string) {
    initProvider()
    const proxyModuleMainContract = moduleMainContract.attach(address)
    let keysetHash = ''
    try {
      keysetHash = await proxyModuleMainContract.getKeysetHash()
    } catch (error) {
      //
    }
    return keysetHash
  },

  async getNonce(address: string): Promise<number> {
    initProvider()
    const proxyModuleMainContract = moduleMainContract.attach(address)
    let nonce = 0
    try {
      nonce = await proxyModuleMainContract.getNonce()
    } catch (error) {
      //
      console.log(error)
    }
    return Number(nonce.toString()) + 1
  },

  async getNetwork(): Promise<providers.Network> {
    initProvider()
    return await provider.getNetwork()
  },

  async getLockInfo(address: string): Promise<IPendingStatus> {
    initProvider()
    let isPending = false
    let newKeysetHash = '0x'
    let timestamp = 0

    try {
      const proxyModuleMainContract = moduleMainContract.attach(address)
      const pendingStatus = await proxyModuleMainContract.getLockInfo()
      console.log(pendingStatus)
      isPending = pendingStatus[0]
      newKeysetHash = pendingStatus[2]
      if (!isPending) {
        newKeysetHash = '0x'
      } else {
        timestamp = pendingStatus[3].toNumber()
      }

      return { isPending, newKeysetHash, timestamp }
    } catch (error) {
      console.error(error)
      return { isPending, newKeysetHash, timestamp }
    }
  },

  async getAddressAssest(address: string) {
    initProvider()
    const balance = await provider.getBalance(address)
    const maticBalance = utils.formatEther(balance)
    return { maticBalance }
  },

  async getTransactionReceipt(hash: string) {
    initProvider()
    try {
      const res = await provider.getTransactionReceipt(hash)
      return res
    } catch (error) {
      //
    }
    return null
  },
  generateAccountAddress(keysetHash: string) {
    initProvider()
    return getWalletAddress(MainModuleAddress, keysetHash)
  },
}
export default blockchain
