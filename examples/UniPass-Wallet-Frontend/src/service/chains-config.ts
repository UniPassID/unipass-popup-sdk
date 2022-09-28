import { ChainType } from '@unipasswallet/provider'

export type SymbolType = 'MATIC' | 'USDC' | 'USDT' | 'BNB' | 'RPG'
export interface Chain {
  chain: ChainType
  tokens: Token[]
  RPC: string
  authChainNode: string
}
export interface Token {
  symbol: SymbolType
  contractAddress: string
  gasFee: string
  decimals: number
}

export interface TokenInfo extends Token {
  chain: ChainType
  balance: string
}

export const multicallAddress = '0x175d02d277eac0838af14D09bf59f11B365BAB42'

const chainsConfig: Chain[] = [
  {
    chain: 'polygon',
    RPC: process.env.VUE_APP_Polygon_RPC || '',
    authChainNode: process.env.VUE_APP_Net === 'testnet' ? 'polygon-mumbai' : 'polygon-mainnet',
    tokens: [
      {
        symbol: 'MATIC',
        contractAddress: '0x0000000000000000000000000000000000000000',
        gasFee: '0.00001',
        decimals: 18,
      },
      {
        symbol: 'USDC',
        contractAddress: process.env.VUE_APP_Polygon_USDC || '',
        gasFee: '0.001',
        decimals: 6,
      },
      {
        symbol: 'USDT',
        contractAddress: process.env.VUE_APP_Polygon_USDT || '',
        gasFee: '0.001',
        decimals: 6,
      },
    ],
  },
  {
    chain: 'bsc',
    RPC: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    authChainNode: process.env.VUE_APP_Net === 'testnet' ? 'bsc-testnet' : 'bsc-mainnet',
    tokens: [
      {
        symbol: 'BNB',
        contractAddress: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        gasFee: '0.00001',
      },
      {
        symbol: 'USDC',
        contractAddress: process.env.VUE_APP_BSC_USDC || '',
        gasFee: '0.001',
        decimals: 6,
      },
      {
        symbol: 'USDT',
        contractAddress: process.env.VUE_APP_BSC_USDT || '',
        gasFee: '0.001',
        decimals: 6,
      },
    ],
  },
  {
    chain: 'rangers',
    RPC: process.env.VUE_APP_Rangers_RPC || '',
    authChainNode: process.env.VUE_APP_Net === 'testnet' ? 'rangers-robin' : 'rangers-mainnet',
    tokens: [
      {
        contractAddress: '0x0000000000000000000000000000000000000000',
        symbol: 'RPG',
        gasFee: '0.00001',
        decimals: 18,
      },
    ],
  },
]

export const getChain = (chain: ChainType) => {
  return chainsConfig.find((e) => e.chain === chain)
}

export default chainsConfig
