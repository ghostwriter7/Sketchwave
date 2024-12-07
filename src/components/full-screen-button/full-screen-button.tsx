import { createSignal } from 'solid-js';
import { Icon } from '../icon/icon.tsx';

export const FullScreenButton = () => {
  const [active, setActive] = createSignal(!!document.fullscreenElement);

  const handleClick = () => active()
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen({ navigationUI: 'hide' });

  document.addEventListener('fullscreenchange', () => setActive(!!document.fullscreenElement));

  return <button classList={{ active: active() }} onClick={handleClick} title="Full Screen (F11)">
    <Icon icon="screenshot_monitor" />
  </button>
}
