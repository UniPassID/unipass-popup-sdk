import { BigNumber, Contract, providers } from 'ethers'
import { aggregate } from '@makerdao/multicall'
import { formatUnits } from 'ethers/lib/utils'
import chainsConfig, { Chain, multicallAddress } from '@/service/chains-config'

// assets
// https://www.notion.so/lay2/a7689630c9964bac97d9b3c19b1a5d50

let provider: providers.JsonRpcProvider
let erc20USDC: Contract
let erc20USDT: Contract

const erc20Abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint amount) returns (bool)',
]

const initProvider = () => {
  if (!provider) {
    provider = new providers.JsonRpcProvider(process.env.VUE_APP_Polygon_RPC)
    erc20USDC = new Contract(process.env.VUE_APP_Polygon_USDC || '', erc20Abi, provider)
    erc20USDT = new Contract(process.env.VUE_APP_Polygon_USDT || '', erc20Abi, provider)
  }
}
initProvider()

const assets = {
  async getAssets(account: string) {
    const promiseArray = []
    for (const chain of chainsConfig) {
      promiseArray.push(this.getAsset(account, chain))
    }
    const resArray = await Promise.all(promiseArray)
    const result = []
    for (const tokens of resArray) {
      for (const token of tokens) {
        result.push(token)
      }
    }
    return result
  },
  async getAsset(account: string, chain: Chain) {
    try {
      const calls = []
      for (let i = 0; i < chain.tokens.length; i++) {
        const token = chain.tokens[i]
        const contractAddress = token.contractAddress
        if (contractAddress === '0x0000000000000000000000000000000000000000') {
          calls.push({
            target: multicallAddress,
            call: ['getEthBalance(address)(uint256)', account],
            returns: [[`TOKEN_BALANCE_${i}`, (val: any) => val]],
          })
        } else {
          calls.push({
            target: contractAddress,
            call: ['symbol()(string)'],
            returns: [[`TOKEN_SYMBOL_${i}`, (val: any) => val]],
          })
          calls.push({
            target: contractAddress,
            call: ['name()(string)'],
            returns: [[`TOKEN_NAME_${i}`, (val: any) => val]],
          })

          calls.push({
            target: contractAddress,
            call: ['decimals()(uint256)'],
            returns: [[`TOKEN_DECIMAL_${i}`, (val: any) => val]],
          })

          calls.push({
            target: contractAddress,
            call: ['balanceOf(address)(uint256)', account],
            returns: [[`TOKEN_BALANCE_${i}`, (val: any) => val]],
          })
        }
      }
      const {
        results: { transformed },
      } = await aggregate(calls, {
        rpcUrl: chain.RPC,
        multicallAddress,
      })
      const result = []
      for (let i = 0; i < chain.tokens.length; i++) {
        const token = chain.tokens[i]
        const contractAddress = token.contractAddress
        const isNative = contractAddress === '0x0000000000000000000000000000000000000000'
        const decimals = isNative ? token.decimals : Number(transformed[`TOKEN_DECIMAL_${i}`])
        result.push({
          chain: chain.chain,
          symbol: isNative ? token.symbol : transformed[`TOKEN_SYMBOL_${i}`],
          name: isNative ? token.symbol : transformed[`TOKEN_NAME_${i}`],
          decimals,
          balance: formatUnits(transformed[`TOKEN_BALANCE_${i}`], decimals),
          gasFee: token.gasFee,
          contractAddress,
        })
      }
      return result
    } catch (err) {
      console.error('load asset error', err)
      return []
    }
  },

  getTransferData(toAddress: string, value: BigNumber, erc20ContractAddress: string): string {
    let ercToken: Contract = new Contract(erc20ContractAddress, erc20Abi, provider)
    for (const chain of chainsConfig) {
      for (const token of chain.tokens) {
        if (erc20ContractAddress === token.contractAddress) {
          if (token.symbol === 'USDC') {
            ercToken = erc20USDC
            // } else if (token.symbol === 'ETH') {
            //   ercToken = erc20ETH
          } else if (token.symbol === 'USDT') {
            ercToken = erc20USDT
          }
        }
      }
    }
    const data = ercToken.interface.encodeFunctionData('transfer', [toAddress, value])
    console.log({ address: ercToken.address })
    return data
  },
}

export default assets
