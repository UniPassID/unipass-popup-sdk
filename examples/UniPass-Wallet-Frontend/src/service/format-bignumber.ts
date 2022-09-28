import { ethers, BigNumberish } from 'ethers'

export const weiToEther = (wei: BigNumberish, decimal = 18) => {
  return ethers.utils.formatUnits(wei, decimal)
}

export const etherToWei = (ether: string, decimal = 18) => {
  return ethers.utils.parseUnits(ether, decimal)
}
