import { IEthereumProvider, ProviderAccounts, RequestArguments } from 'eip1193-provider';
import { UPAccount } from '@unipasswallet/popup-types';
import { JsonRpcProvider } from './json-rpc-provider';
import { UniPassProviderOptions } from './type';

class UniPassProvider implements IEthereumProvider {
    private account?: UPAccount = undefined

    public readonly chainId: number
    public readonly signer: JsonRpcProvider;

    constructor(options: UniPassProviderOptions) {
        this.chainId = options.chainId
        this.signer = new JsonRpcProvider(this.chainId, options.appSettings)
    }

    public async request(args: RequestArguments): Promise<any> {
        switch (args.method) {
            case "eth_requestAccounts":
                const account = await this.connect();
                return account
            case "eth_accounts":
                return [this.account?.address || ''];
            case "eth_chainId":
                return this.chainId;
            default:
                break;
        }
        return await this.signer.request(args)
    }

    public async connect() {
        const account = await this.signer.connect()
        this.account = account
        return account
    }

    public async disconnect(): Promise<void> {
        await this.signer.disconnect();
        this.account = undefined
    }

    public async enable(): Promise<ProviderAccounts> {
        const account = await this.request({ method: 'eth_requestAccounts' })
        return [account?.address || '']
    }

    public isUniPassProvider(): boolean {
        return true
    }

    on(event: unknown, listener: unknown): void {
        throw new Error('Method not implemented.');
    }

    once(event: string, listener: any): void {
        throw new Error('Method not implemented.');
    }
    removeListener(event: string, listener: any): void {
        throw new Error('Method not implemented.');
    }
    off(event: string, listener: any): void {
        throw new Error('Method not implemented.');
    }

}

export default UniPassProvider