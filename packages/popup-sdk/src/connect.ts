import {
  UPAccount,
  UPConnectOptions,
  UPMessage,
} from '@unipasswallet/popup-types';
import { execPop, UPA_SESSION_KEY } from './bridge';
import { PopupSDKConfig, StorageType } from './config';
import { useStorage } from './storage';

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

export const disconnect = async (deep: boolean) => {
  if (deep) {
    const message = new UPMessage('UP_LOGOUT');
    await execPop(message);
  }
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
      options?.forceLogin,
      options?.eventListener
    )) as UPAccount;
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
