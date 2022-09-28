/* eslint-disable */
import { Contract, providers, Wallet } from 'ethers'
import { getWalletAddress } from '@unipasswallet/utils'
import { moduleMain } from '@unipasswallet/abi'
import { unipassWalletContext } from '@unipasswallet/network'

export interface IPendingStatus {
  isPending: boolean
  newKeysetHash: string
  timestamp: number
}

export class MultiChainContranctData {
  private provider!: providers.JsonRpcProvider
  private moduleMainContract!: Contract
  private moduleGuestContract!: Contract

  private authChainNode = process.env.VUE_APP_GEN_NODE
  private MainModuleAddress = unipassWalletContext.moduleMain || ''
  private ModuleGuestAddress = unipassWalletContext.moduleGuest || ''

  constructor(authChainNode?: string, walletPrivateKey?: string) {
    if (authChainNode) this.authChainNode = authChainNode
    this.initProvider(authChainNode, walletPrivateKey)
  }

  initProvider(authChainNode?: string, walletPrivateKey?: string) {
    const rpcUrl = `${process.env.VUE_APP_RPC_BaseURL}/${authChainNode}`
    if (!this.provider || authChainNode !== this.authChainNode) {
      this.provider = new providers.JsonRpcProvider(rpcUrl)
      if (walletPrivateKey) {
        const wallet = new Wallet(walletPrivateKey, this.provider)
        this.moduleMainContract = new Contract(this.MainModuleAddress, moduleMain.abi, wallet)
        this.moduleGuestContract = new Contract(this.ModuleGuestAddress, moduleMain.abi, wallet)
      } else {
        this.moduleMainContract = new Contract(
          this.MainModuleAddress,
          moduleMain.abi,
          this.provider,
        )
        this.moduleGuestContract = new Contract(
          this.ModuleGuestAddress,
          moduleMain.abi,
          this.provider,
        )
      }
    }
  }

  getModuleMainContract(): Contract {
    return this.moduleMainContract
  }
  getModuleGuestContract(): Contract {
    return this.moduleGuestContract
  }

  getProvider(): providers.JsonRpcProvider {
    return this.provider
  }

  generateAccountAddress(keysetHash: string) {
    return getWalletAddress(this.MainModuleAddress, keysetHash)
  }
  async getTransactionReceipt(hash: string) {
    try {
      const res = await this.provider.getTransactionReceipt(hash)
      return res
    } catch (error) {
      //
    }
    return null
  }

  async getLockInfo(address: string): Promise<IPendingStatus> {
    let isPending = false
    let newKeysetHash = '0x'
    let timestamp = 0
    try {
      const proxyModuleMainContract = this.moduleMainContract.attach(address)
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
  }

  async getNetwork(): Promise<providers.Network> {
    return await this.provider.getNetwork()
  }

  async getNonce(address: string): Promise<number> {
    const proxyModuleMainContract = this.moduleMainContract.attach(address)
    let nonce = 0
    try {
      nonce = await proxyModuleMainContract.getNonce()
    } catch (error) {
      //
      console.log(error)
    }
    return Number(nonce.toString()) + 1
  }

  async getAccountKeysetHash(address: string) {
    const proxyModuleMainContract = this.moduleMainContract.attach(address)
    let keysetHash = '0x'
    try {
      keysetHash = await proxyModuleMainContract.getKeysetHash()
    } catch (error) {}
    return keysetHash
  }

  async getContract(address: string): Promise<Contract> {
    const proxyModuleMainContract = this.moduleMainContract.attach(address)
    return proxyModuleMainContract
  }

  async getMetaNonce(address: string): Promise<number> {
    const proxyModuleMainContract = this.moduleMainContract.attach(address)
    let metaNonce = 0

    try {
      metaNonce = await proxyModuleMainContract.getMetaNonce()
    } catch (error) {
      //
    }

    return Number(metaNonce.toString()) + 1
  }

  async isRegistered(address: string): Promise<boolean> {
    const code = await this.provider.getCode(address)
    return code !== '0x'
  }
}

export default MultiChainContranctData
