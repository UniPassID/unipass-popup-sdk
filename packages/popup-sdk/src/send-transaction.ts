import { execPop, UPA_SESSION_KEY } from './bridge';
import {
  UPAccount,
  UPTransactionMessage,
  UPMessage,
  AppSettings,
} from '@unipasswallet/popup-types';

export const sendTransaction = async (
  tx: UPTransactionMessage,
  appSettings?: AppSettings
): Promise<string> => {
  const sessionAccount = sessionStorage.getItem(UPA_SESSION_KEY);
  const account = sessionAccount && (JSON.parse(sessionAccount) as UPAccount);

  if (
    !account ||
    !tx.from ||
    account.address.toLowerCase() !== tx.from.toLowerCase()
  ) {
    throw new Error('can not authorize without login');
  }
  const msg = new UPMessage('UP_TRANSACTION', JSON.stringify(tx), appSettings);

  try {
    const resp: string = (await execPop(msg)) as string;
    return resp;
  } catch (err) {
    throw new Error(err as string);
  }
};
