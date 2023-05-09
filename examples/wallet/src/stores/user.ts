import type { ChainType } from "@unipasswallet/popup-types";
import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "userStore",
  state: () => {
    return {
      address: "",
      email: "",
      newborn: false,
      chainType: "polygon" as ChainType,
      // connect and auth
      message: "",
      signature: "",
    };
  },
  actions: {},
});
