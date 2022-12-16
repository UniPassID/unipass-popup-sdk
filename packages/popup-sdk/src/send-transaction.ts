import { useStorage } from './storage';
import { PopupSDKConfig } from './config';
import { execPop, UPA_SESSION_KEY } from './bridge';
import {
  UPAccount,
  UPTransactionMessage,
  UPMessage,
} from '@unipasswallet/popup-types';

export const sendTransaction = async (
  tx: UPTransactionMessage,
  config: PopupSDKConfig
): Promise<string> => {
  const sessionAccount = useStorage(config.storageType).get(UPA_SESSION_KEY);
  const account = sessionAccount && (JSON.parse(sessionAccount) as UPAccount);

  if (
    !account ||
    !tx.from ||
    account.address.toLowerCase() !== tx.from.toLowerCase()
  ) {
    throw new Error('can not authorize without login');
  }
  const msg = new UPMessage(
    'UP_TRANSACTION',
    JSON.stringify(tx),
    config.appSettings
  );

  try {
    const resp: string = (await execPop(msg)) as string;
    return resp;
  } catch (err) {
    throw new Error(err as string);
  }
};
