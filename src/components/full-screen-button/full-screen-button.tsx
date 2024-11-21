import { createSignal } from 'solid-js';

export const FullScreenButton = () => {
  const [active, setActive] = createSignal(!!document.fullscreenElement);

  const handleClick = () => active()
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen({ navigationUI: 'hide' });

  document.addEventListener('fullscreenchange', () => setActive(!!document.fullscreenElement));

  return <button classList={{ active: active() }} onClick={handleClick} title="Full Screen (F11)">
    <span class="material-symbols-outlined">
      screenshot_monitor
    </span>
  </button>
}
