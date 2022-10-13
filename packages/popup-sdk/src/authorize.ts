import { execPop, UPA_SESSION_KEY } from './bridge';
import {
  UPAccount,
  UPAuthMessage,
  UPMessage,
  AppSettings,
} from '@unipasswallet/popup-types';

export const authorize = async (
  message: UPAuthMessage,
  appSettings?: AppSettings
): Promise<string> => {
  const sessionAccount = sessionStorage.getItem(UPA_SESSION_KEY);
  const account = sessionAccount && (JSON.parse(sessionAccount) as UPAccount);
  if (!account || !message.from || account.address !== message.from) {
    throw new Error('can not authorize without login');
  }
  const msg = new UPMessage(
    'UP_SIGN_MESSAGE',
    JSON.stringify(message),
    appSettings
  );

  try{
    const resp: string = (await execPop(msg)) as string;
    return resp;
  }catch(err){
    throw new Error(err as string);
  }
};
