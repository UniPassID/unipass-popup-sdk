import {
  ConnectType,
  UPMessage,
  UPMessageType,
} from '@unipasswallet/popup-types';
import { getConfig } from './config';
import { renderPop } from './render-pop';

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

// const GOOGLE_OAUTH_CONFIG = {
//   clientID:
//     '1076249686642-g0d42524fhdirjeho0t6n3cjd7pulmns.apps.googleusercontent.com',
// };

// const genGoogleOAuthUrl = () => {
//   const redirectURI = encodeURIComponent(
//     serviceEndPoint('UP_LOGIN') + '/loading'
//   );
//   return `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?redirect_uri=${redirectURI}&prompt=consent&response_type=id_token%20token&client_id=${GOOGLE_OAUTH_CONFIG.clientID}&scope=openid%20email&state=af0ifjsldkj&nonce=n-0S6_WzA2Mj&flowName=GeneralOAuthFlow`;
// };

function serviceEndPoint(type: UPMessageType, connectType?: ConnectType, forceLogin?: boolean) {
  if (type === 'UP_LOGIN') {
    if (connectType === 'google') {
      return getConfig().upConnectUrl + `?connectType=google&forceLogin=${forceLogin ? '1' : '0'}`;
    }
    if (connectType === 'email') {
      return getConfig().upConnectUrl + `?connectType=email&forceLogin=${forceLogin ? '1' : '0'}`;
    }
    return getConfig().upConnectUrl + `?forceLogin=${forceLogin ? '1' : '0'}`;
  } else if (type === 'UP_LOGOUT') {
    return getConfig().upLogoutUrl;
  } else if (type === 'UP_SIGN_MESSAGE') {
    return getConfig().upSignMessageUrl;
  } else if (type === 'UP_TRANSACTION') {
    return getConfig().upTransactionUrl;
  } else if (type === 'UP_READY') {
    return getConfig().upLoadingUrl;
  }

  throw new Error(`unsupport type ${type}`);
}

export async function pop(
  message: UPMessage,
  connectType?: ConnectType,
  forceLogin?: boolean,
  opts?: MessageHandler
) {
  if (message == null) return { send: noop, close: noop };

  const onClose = opts?.onClose || noop;
  const onMessage = opts?.onMessage || noop;
  const onReady = opts?.onReady || noop;
  const onResponse = opts?.onResponse || noop;

  window.addEventListener('message', internal);
  const { popup, unmount } = (await renderPop(
    serviceEndPoint(message.type, connectType, forceLogin),
    onResponse,
    message.appSetting
  )) as any;

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
