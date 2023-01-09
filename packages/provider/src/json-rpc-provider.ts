import { providers } from 'ethers'
import { RequestArguments } from 'eip1193-provider';
import { AppSettings, } from "@unipasswallet/popup-types";
import { UniPassPopupSDK } from "@unipasswallet/popup-sdk";
import { getENVByChainId, getChainNameByChainId, getRPCByChainId, getSignTypedDataParamsData, getSignParamsMessage } from "./utils";


export class JsonRpcProvider {
    private appSetting?: Omit<AppSettings, 'chain'>
    public readonly upWallet: UniPassPopupSDK
    public readonly chainId: number
    public readonly http: providers.JsonRpcProvider

    constructor(chainId: number, appSetting?: Omit<AppSettings, 'chain'>) {
        this.appSetting = appSetting
        this.chainId = chainId
        this.upWallet = new UniPassPopupSDK({
            env: getENVByChainId(chainId),
            chainType: getChainNameByChainId(chainId),
            appSettings: this.appSetting,
            storageType: "sessionStorage",
        });
        this.http = new providers.JsonRpcProvider(getRPCByChainId(chainId))
    }

    public async connect() {
        const account = this.upWallet.getAccount();
        if (account) return account;
        return this.upWallet.login()
    }

    public async disconnect() {
        await this.upWallet.logout()
    }

    public async request(request: RequestArguments): Promise<any> {
        if (request.method.startsWith('eth_signTypedData')) {
            return this.upWallet.signTypedData(getSignTypedDataParamsData(request.params as string[]))
        } else if (request.method === 'personal_sign') {
            return this.upWallet.signMessage(getSignParamsMessage(request.params as string[]))
        } else if (request.method === 'eth_sendTransaction') {
            const _params = request?.params && Array.isArray(request?.params) && request?.params[0] ? request?.params[0] : undefined
            if (_params) {
                return await this.upWallet.sendTransaction(_params);
            }
            throw new Error('eth_sendTransaction error')
        } else {
            return await this.http.send(request.method, (request.params || []) as Array<any>)
        }
    }
}
