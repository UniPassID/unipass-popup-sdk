import { WindowSettings } from '@unipasswallet/popup-types';

const FRAME = 'UNIPASS_IFRAME';
const FRAME_STYLES_SHOW = `
  position:fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  height: 100%;
  width: 100vw;
  display:block;
  background:rgba(0,0,0,0.25);
  z-index: 2147483647;
  box-sizing: border-box;
  color-scheme: light;
`;

export function createIframe(src: string, windowSettings?: WindowSettings) {
  const $frame = document.createElement('iframe');
  $frame.src = src;
  $frame.name = FRAME;
  $frame.id = FRAME;
  $frame.allow = 'usb *; hid *';
  $frame.style.cssText = windowSettings?.styles || FRAME_STYLES_SHOW;

  if (!windowSettings?.getContainer) {
    document.body.append($frame);
  } else if (typeof windowSettings.getContainer === 'string') {
    const container = document.querySelector(windowSettings.getContainer);
    if (container) {
      document.querySelector(windowSettings.getContainer)?.append($frame);
    } else {
      throw new Error(`Can not find element: ${windowSettings.getContainer}`);
    }
  } else {
    windowSettings.getContainer.append($frame);
  }

  const unmount = () => {
    const frame = document.getElementById(FRAME);
    if (frame) {
      frame.remove();
    }
  };

  return { popup: $frame.contentWindow, unmount };
}
