import { useStorage } from './storage';
import { PopupSDKConfig, StorageType } from './config';
import { execPop, UPA_SESSION_KEY } from './bridge';
import {
  UPAccount,
  UPConnectOptions,
  UPMessage,
} from '@unipasswallet/popup-types';

export const connect = async (
  config: PopupSDKConfig,
  options?: UPConnectOptions
): Promise<UPAccount> => {
  const sessionAccount = useStorage(config.storageType).get(UPA_SESSION_KEY);
  const account: UPAccount =
    (sessionAccount && (JSON.parse(sessionAccount) as UPAccount)) ||
    (await getAccount(config, options));

  return account;
};

export const getLocalAccount = (
  storageType: StorageType
): UPAccount | undefined => {
  const sessionAccount = useStorage(storageType).get(UPA_SESSION_KEY);

  if (sessionAccount) {
    return JSON.parse(sessionAccount) as UPAccount;
  } else {
    return undefined;
  }
};

export const disconnect = () => {
  useStorage('localStorage').remove(UPA_SESSION_KEY);
  useStorage('sessionStorage').remove(UPA_SESSION_KEY);
};

const getAccount = async (
  config: PopupSDKConfig,
  options?: UPConnectOptions
): Promise<UPAccount> => {
  try {
    const payload = options ? JSON.stringify(options) : '';
    const message = new UPMessage('UP_LOGIN', payload, config.appSettings);

    const account: UPAccount = (await execPop(
      message,
      options?.connectType,
      options?.eventListener
    )) as UPAccount;
    console.log('connect resp', account);
    if (account && account.address) {
      useStorage(config.storageType).set(
        UPA_SESSION_KEY,
        JSON.stringify(account)
      );
    }

    return account;
  } catch (e) {
    throw new Error('Account Not Available');
  }
};
