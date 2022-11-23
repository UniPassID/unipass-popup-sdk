import type { ChainType } from "@unipasswallet/popup-types";
import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "userStore",
  state: () => {
    return {
      address: "",
      email: "",
      newborn: false,
      //
      chainType: "polygon" as ChainType,
      chainCoin: {
        polygon: "Matic",
        bsc: "BNB",
        rangers: "RPG",
      },
      chainName: {
        polygon: "Polygon-mumbai",
        bsc: "BSC-testnet",
        rangers: "Rangers-robin",
      },
    };
  },
  actions: {},
});
