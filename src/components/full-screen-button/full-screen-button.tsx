import { createSignal } from 'solid-js';
import './full-screen-button.css';

export const FullScreenButton = () => {
  const [active, setActive] = createSignal(!!document.fullscreenElement);

  const handleClick = () => active()
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen({ navigationUI: 'hide' });

  document.addEventListener('fullscreenchange', () => setActive(!!document.fullscreenElement));

  return <button classList={{ active: active() }} onClick={handleClick}>
    <span class="material-symbols-outlined">
      screenshot_monitor
    </span>
  </button>
}
