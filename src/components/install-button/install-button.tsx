import { createSignal, Show } from 'solid-js';
import { Icon } from '../icon/icon.tsx';

export const InstallButton = () => {
  const [deferredPromptEvent, setDeferredPromptEvent] = createSignal<BeforeInstallPromptEvent | null>(null);

  addEventListener('beforeinstallprompt', (event: BeforeInstallPromptEvent) => {
    event.preventDefault();
    setDeferredPromptEvent(event);
  });

  const triggerEvent = async () => {
    const event = deferredPromptEvent();
    if (event) {
      event.prompt();
      // const userChoice = await event.userChoice;
      // TODO to be continued...
    }
  }

  return <Show when={deferredPromptEvent()}>
    <button onClick={triggerEvent}>
     <Icon icon="install_desktop" /> Install
    </button>
  </Show>
}
