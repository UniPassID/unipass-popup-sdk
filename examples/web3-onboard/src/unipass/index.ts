// @ts-nocheck

import type {
  WalletInit,
  WalletHelpers,
  GetInterfaceHelpers,
  WalletModule
} from '@web3-onboard/common'
import { UniPassProviderOptions } from '@unipasswallet/ethereum-provider'

function unipass(option: UniPassProviderOptions): WalletInit {
  return (_helpers: WalletHelpers) => {
    return {
      label: 'UniPass',
      getIcon: async () => (await import('./icon.ts')).default,
      getInterface: async (
        _helpers: GetInterfaceHelpers
      ): Promise<WalletModule> => {
        const { UniPassProvider } = await import(
          '@unipasswallet/ethereum-provider'
        )

        const { createEIP1193Provider } = await import('@web3-onboard/common')

        const instance = new UniPassProvider(option)

        if (!instance.isConnected()) {
          await instance.connect()
        }

        if (instance.isConnected()) {
          const provider = createEIP1193Provider(instance, {
            eth_requestAccounts: async () => {
              const upAccount = await instance.connect()
              return [upAccount.address]
            },
            eth_chainId: async () => {
              const chainId = instance.getChainId()
              return `0x${chainId.toString(16)}`
            }
          })

          return {
            provider,
            instance
          }
        }

        throw new Error('Failed to connect unipass wallet')
      }
    }
  }
}

export default unipass
