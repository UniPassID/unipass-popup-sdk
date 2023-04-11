import {
  ConnectType,
  UPEvent,
  UPEventListener,
  UPMessage,
  UPResponse,
} from '@unipasswallet/popup-types';
import { disconnect } from './connect';
import { Callbacks, pop } from './pop';

export const UPA_SESSION_KEY = 'UP-A';

export function execPop(
  message: UPMessage,
  connectType?: ConnectType,
  forceLogin?: boolean,
  listener?: UPEventListener
) {
  return new Promise(async (resolve, reject) => {
    await pop(
      message,
      connectType,
      forceLogin,
      {
        async onReady(_, callbacks: Callbacks) {
          const { send } = callbacks;
          try {
            send(message);
          } catch (err) {
            throw err;
          }
        },
        async onResponse(e: MessageEvent, callbacks: Callbacks) {
          const { close } = callbacks;
          try {
            if (typeof e.data !== 'object') return;
            const up_message = e.data as UPMessage;
            const resp = JSON.parse(up_message.payload as string) as UPResponse;
            switch (resp.type) {
              case 'APPROVE':
                resolve(resp.data);
                close();
                break;
              case 'DECLINE':
                if (resp.data === 'expired') {
                  if (message.type === 'UP_LOGIN') {
                    return;
                  }

                  if (message.type === 'UP_LOGOUT') {
                    resolve(resp.data);
                    close();
                    return;
                  }

                  if (
                    message.type === 'UP_TRANSACTION' ||
                    message.type === 'UP_SIGN_MESSAGE'
                  ) {
                    // clear session storage
                    disconnect(false);
                    reject(`can not authorize without login`);
                    close();
                    break;
                  }
                }

                reject(`Declined: ${resp.data || 'No reason supplied'}`);
                close();
                break;
              default:
                reject(`Declined: No reason supplied`);
                close();
                break;
            }
          } catch (err) {
            throw err;
          }
        },
        async onMessage(e: MessageEvent, _callbacks: Callbacks) {
          if (!listener) return;

          try {
            if (typeof e.data !== 'object') return;
            const up_message = e.data as UPMessage;
            const upEvent = JSON.parse(up_message.payload as string) as UPEvent;

            listener(upEvent);
          } catch (err) {
            throw err;
          }
        },
        async onClose() {
          reject(`Declined: Externally Halted`);
        },
      }
      // type
    );
  });
}
