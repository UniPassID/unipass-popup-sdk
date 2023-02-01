import { BigNumberish } from "@ethersproject/bignumber";
import { ethers } from "ethers";

export const weiToEther = (wei: BigNumberish, decimal: number = 18) => {
  return ethers.utils.formatUnits(wei, decimal);
};

export const etherToWei = (ether: string, decimal: number = 18) => {
  return ethers.utils.parseUnits(ether, decimal);
};
