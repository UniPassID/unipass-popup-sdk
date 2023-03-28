import { AppSettings, UPMessage, UPResponse } from '@unipasswallet/popup-types';
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

export async function renderPop(
  src: string,
  onResponse: ((e: MessageEvent, callbacks: Callbacks) => {}) | typeof noop,
  appSettings?: AppSettings
) {
  if (popup == null || popup?.closed) {
    popup = popupWindow(src, POP, window);
    if (popup == null) {
      return await createBlockedTip(src, onResponse, appSettings);
    }
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

async function createBlockedTip(
  src: string,
  onResponse: ((e: MessageEvent, callbacks: Callbacks) => {}) | typeof noop,
  appSettings?: AppSettings
) {
  const divHTML = document.createElement('div');
  const innerHtml = `
  <div
  class="up_notification"
  style="
    position: fixed;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    top: 26px;
    right: 26px;
    width: 340px;
    height: 96px;
    z-index: 100001;
    background-color: #362866;
    box-sizing: border-box;
    border: 2px solid #ffffff;
    border-radius: 8px;
    padding: 16px 20px;
  "
>
  <div class="up_notification_left" style="color: white">
    <div
      class="up_notification_title"
      style="
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 8px;
      "
    >
      Request Pop-up
    </div>
    <div
      class="up_notification_tip"
      style="
        font-weight: 450;
        font-size: 12px;
        line-height: 20px;
        color: rgba(255, 255, 255, 0.8);
      "
    >
      Click Approve to complete creating or using wallet
    </div>
  </div>
  <div
    class="up_notification_right"
    style="
      width: 90px;
      height: 35px;
      font-size: 12px;
      text-align: center;
      background: linear-gradient(270deg, #997afb 0%, #7a55f8 63.6%);
      border-radius: 6px;
      line-height: 35px;
      color: white;
      margin-left: 20px;
      cursor: pointer;
    "
  >
    Approve
  </div>
</div>
    `;
  divHTML.innerHTML = innerHtml;
  document.body.appendChild(divHTML);
  const up_button = document.querySelector<HTMLDivElement>(
    '.up_notification_right'
  );
  return new Promise((resolve) => {
    up_button?.addEventListener(
      'click',
      function () {
        document.body.removeChild(divHTML);
        resolve(renderPop(src, onResponse, appSettings));
      },
      false
    );
  });
}
