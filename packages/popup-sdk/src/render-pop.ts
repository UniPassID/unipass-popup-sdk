import { UPMessage, UPResponse } from '@unipasswallet/popup-types';
import { Callbacks } from './pop';

const POP = 'UP_WALLET_POP';

var popup: Window | null = null;
let previousUrl: string | null = null;

function popupWindow(url: string, windowName: string, win: Window) {
  const w = 462;
  const h = 810;
  const top = (win.screen.availHeight - 30 - h) * 0.5;
  const left = (win.screen.availWidth - 10 - w) * 0.8;
  const config = `innerWidth=${w},width=${w},innerHeight=${h},height=${h},top=${top},left=${left},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,`;
  return win.open(url, windowName, config);
}

const noop = () => {};

export function renderPop(
  src: string,
  onResponse: ((e: MessageEvent, callbacks: Callbacks) => {}) | typeof noop
) {
  if (popup == null || popup?.closed) {
    popup = popupWindow(src, POP, window);
  } else if (previousUrl !== src) {
    popup.location.replace(src);
    popup.focus();
  } else {
    popup.focus();
  }

  // previousUrl = src;

  var timer = setInterval(function () {
    if (popup && popup.closed) {
      const event = {
        data: new UPMessage(
          'UP_RESPONSE',
          JSON.stringify(new UPResponse('DECLINE', 'user reject connection'))
        ),
      } as MessageEvent;
      onResponse(event, {
        close: () => {},
        send: () => {},
      });
      clearInterval(timer);
    }
  }, 1000);

  const unmount = () => {
    if (popup && !popup.closed) {
      popup.close();
    }
    popup = null;
  };

  return { popup, unmount };
}
