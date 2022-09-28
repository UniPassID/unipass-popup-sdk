declare global {
  interface Window {
    // metamask
    ethereum: any
    // walletconnect
    connector: any
    WeixinJSBridge: any
  }
}

export {}
