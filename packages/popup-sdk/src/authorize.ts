import {
  UPAccount,
  UPAuthMessage,
  UPMessage,
} from '@unipasswallet/popup-types';
import { execPop, UPA_SESSION_KEY } from './bridge';
import { PopupSDKConfig } from './config';
import { useStorage } from './storage';

export const authorize = async (
  message: UPAuthMessage,
  config: PopupSDKConfig
): Promise<string> => {
  const sessionAccount = useStorage(config.storageType).get(UPA_SESSION_KEY);
  const account = sessionAccount && (JSON.parse(sessionAccount) as UPAccount);
  if (
    !account ||
    !message.from ||
    account.address.toLowerCase() !== message.from.toLowerCase()
  ) {
    throw new Error('can not authorize without login');
  }
  const msg = new UPMessage(
    'UP_SIGN_MESSAGE',
    JSON.stringify(message),
    config.windowType,
    config.windowSettings,
    config?.appSettings
  );

  try {
    const resp: string = (await execPop(msg)) as string;
    return resp;
  } catch (err) {
    throw new Error(err as string);
  }
};
