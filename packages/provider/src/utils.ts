import { utils } from 'ethers'
import { ChainType, Environment } from "@unipasswallet/popup-types"

// supported chain ids, do not change
// ethereum
export const ETHEREUM_MAINNET = 1
export const ETHEREUM_GOERLI = 5

// polygon
export const POLYGON_MAINNET = 137
export const POLYGON_MUMBAI = 80001

// bsc
export const BSC_MAINNET = 56
export const BSC_TESTNET = 97

// rangers
export const RANGERS_MAINNET = 2025
export const RANGERS_ROBIN = 9527

// scroll testnet only
export const SCROLL_TESTNET = 534354

// arbitrum
export const ARBITRUM_TESTNET = 421613
export const ARBITRUM_MAINNET = 42161


export const getChainNameByChainId = (id: number | string): ChainType => {
    switch (Number(id)) {
        case ETHEREUM_MAINNET:
        case ETHEREUM_GOERLI:
            return 'eth'

        case POLYGON_MAINNET:
        case POLYGON_MUMBAI:
            return 'polygon'

        case BSC_MAINNET:
        case BSC_TESTNET:
            return 'bsc'

        case RANGERS_MAINNET:
        case RANGERS_ROBIN:
            return 'rangers'

        case SCROLL_TESTNET:
            return 'scroll'

        case ARBITRUM_TESTNET:
            return 'arbitrum'

        default:
            return 'polygon'
    }
}

export const getENVByChainId = (id: number | string): Environment => {
    switch (Number(id)) {
        case ETHEREUM_MAINNET:
        case POLYGON_MAINNET:
        case BSC_MAINNET:
        case RANGERS_MAINNET:
            return 'prod'
        case ETHEREUM_GOERLI:
        case POLYGON_MUMBAI:
        case BSC_TESTNET:
        case RANGERS_ROBIN:
        case SCROLL_TESTNET:
        case ARBITRUM_TESTNET:
            return 'test'
        default:
            return 'test'
    }
}

export const getRPCByChainId = (id: number | string): string => {
    switch (Number(id)) {
        case ETHEREUM_MAINNET:
            return "https://node.wallet.unipass.id/eth-mainnet"
        case POLYGON_MAINNET:
            return "https://node.wallet.unipass.id/polygon-mainnet"
        case BSC_MAINNET:
            return "https://node.wallet.unipass.id/bsc-mainnet"
        case RANGERS_MAINNET:
            return "https://node.wallet.unipass.id/rangers-mainnet"
        case ETHEREUM_GOERLI:
            return "https://node.wallet.unipass.id/eth-goerli"
        case POLYGON_MUMBAI:
            return "https://node.wallet.unipass.id/polygon-mumbai"
        case BSC_TESTNET:
            return "https://node.wallet.unipass.id/bsc-testnet"
        case RANGERS_ROBIN:
            return "https://node.wallet.unipass.id/rangers-robin"
        case SCROLL_TESTNET:
            return "https://node.wallet.unipass.id/scroll-testnet"
        case ARBITRUM_TESTNET:
            return "https://node.wallet.unipass.id/arbitrum-testnet"
        default:
            return "https://node.wallet.unipass.id/polygon-mumbai"
    }
}

function convertHexToUtf8(value: string) {
    if (utils.isHexString(value)) {
        return utils.toUtf8String(value)
    }

    return value
}

export function getSignParamsMessage(params: string[]) {
    const message = params.filter((p) => !utils.isAddress(p))[0]

    return convertHexToUtf8(message)
}


export function getSignTypedDataParamsData(params: string[]) {
    const data = params.filter((p) => !utils.isAddress(p))[0]

    if (typeof data === 'string') {
        return JSON.parse(data)
    }

    return data
}