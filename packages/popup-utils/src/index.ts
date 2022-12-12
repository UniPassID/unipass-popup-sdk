import { UPMessage } from '@unipasswallet/popup-types';
export * from './eip712Hash';

export type MessageHandler = (event: MessageEvent) => void;

let messageHandler: MessageHandler;

export function registerPopupHandler(_messageHandler: MessageHandler) {
  if (!!messageHandler) {
    console.log('messageHandler has been initialized');
    return;
  }

  messageHandler = _messageHandler;
  // send Ready message to SDK
  if (window.opener) {
    window.opener.postMessage(new UPMessage('UP_READY'), '*');
    window.addEventListener('message', _messageHandler, false);
  }
}

export function unregisterPopupHandler() {
  if (messageHandler) window.removeEventListener('message', messageHandler);
}

export function postMessage(message: UPMessage) {
  console.log('window.postMessage', message);
  if (window.opener) {
    window.opener.postMessage(message, '*');
  }
}
