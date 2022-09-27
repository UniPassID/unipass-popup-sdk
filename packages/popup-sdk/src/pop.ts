import { getConfig } from './config';
import { renderPop } from './render-pop';
import { UPMessage, UPMessageType } from '@unipasswallet/popup-types';

export interface Callbacks {
  send: (message: UPMessage) => void;
  close: () => void;
}

export interface MessageHandler {
  onReady: (e: MessageEvent, callbacks: Callbacks) => {};
  onResponse: (e: MessageEvent, callbacks: Callbacks) => {};
  onMessage: (e: MessageEvent, callbacks: Callbacks) => {};
  onClose: () => {};
}

const noop = () => {};
function serviceEndPoint(type: UPMessageType) {
  if (type === 'UP_LOGIN') {
    return getConfig().upConnectUrl;
  } else if (type === 'UP_SIGN_MESSAGE') {
    return getConfig().upAuthUrl;
  } else if (type === 'UP_READY') {
    return getConfig().upLoadingUrl;
  }

  throw new Error(`unsupport type ${type}`);
}

export function pop(message: UPMessage, opts?: MessageHandler) {
  if (message == null) return { send: noop, close: noop };

  const onClose = opts?.onClose || noop;
  const onMessage = opts?.onMessage || noop;
  const onReady = opts?.onReady || noop;
  const onResponse = opts?.onResponse || noop;

  window.addEventListener('message', internal);
  const { popup, unmount } = renderPop(serviceEndPoint(message.type));
  return { send, close };

  function internal(e: MessageEvent) {
    try {
      if (typeof e.data !== 'object') return;
      let data = e.data as UPMessage;
      if (!data || !data.type) return;

      if (e.data.type === 'UP_CLOSE') close();
      if (data.type === 'UP_READY') onReady(e, { send, close });
      if (data.type === 'UP_RESPONSE') onResponse(e, { send, close });

      if (data.type === 'UP_EVENT') onMessage(e, { send, close });
    } catch (error) {
      console.error('Popup Callback Error', error);
      close();
    }
  }

  function close() {
    try {
      window.removeEventListener('message', internal);
      unmount();
      onClose();
    } catch (error) {
      console.error('Popup Close Error', error);
    }
  }

  function send(msg: UPMessage) {
    try {
      popup?.postMessage(JSON.parse(JSON.stringify(msg || {})), '*');
    } catch (error) {
      console.error('Popup Send Error', msg, error);
    }
  }
}
