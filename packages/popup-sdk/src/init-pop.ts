import { UPMessage } from '@unipasswallet/popup-types';
import { pop } from './pop';

export const initPop = () => {
  pop(new UPMessage('UP_READY'));
};
