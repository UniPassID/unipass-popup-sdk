import { UPMessage } from '@unipasswallet/popup-types';
import { ethers, TypedDataDomain, TypedDataField } from 'ethers';

export interface TypedData {
  domain: TypedDataDomain;
  types: Record<string, Array<TypedDataField>>;
  message: Record<string, any>;
  primaryType?: string;
}

export * from './verify-sig';
export type { TypedDataDomain, TypedDataField };

export const encodeTypedDataHash = (typedData: TypedData): string => {
  const types = { ...typedData.types };

  // remove EIP712Domain key from types as ethers will auto-gen it in
  // the hash encoder below
  delete types['EIP712Domain'];

  return ethers.utils._TypedDataEncoder.hash(
    typedData.domain,
    types,
    typedData.message
  );
};

export const encodeTypedDataDigest = (typedData: TypedData): Uint8Array => {
  return ethers.utils.arrayify(encodeTypedDataHash(typedData));
};

export type MessageHandler = (event: MessageEvent) => void;

let messageHandler: MessageHandler;

export function registerPopupHandler(_messageHandler: MessageHandler) {
  if (!!messageHandler) {
    console.log('messageHandler has been initialized');
    return;
  }

  messageHandler = _messageHandler;
  // send Ready message to SDK
  if (window.location !== window.parent.location) {
    console.log('window.parent success');
    window.parent.postMessage(new UPMessage('UP_READY'), '*');
    window.addEventListener('message', _messageHandler, false);
  } else if (window.opener) {
    console.log('window.opener success');
    window.opener.postMessage(new UPMessage('UP_READY'), '*');
    window.addEventListener('message', _messageHandler, false);
  } else {
    console.log('can not use postMessage');
  }
}

export function unregisterPopupHandler() {
  if (messageHandler) window.removeEventListener('message', messageHandler);
}

export function postMessage(message: UPMessage) {
  console.log('window.postMessage', message);
  if (window.location !== window.parent.location) {
    console.log('use window.parent');
    window.parent.postMessage(message, '*');
  } else if (window.opener) {
    console.log('use window.opener');
    window.opener.postMessage(message, '*');
  } else {
    console.log('can not use postMessage');
  }
}
