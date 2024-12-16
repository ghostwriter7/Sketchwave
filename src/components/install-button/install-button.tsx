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
      const { outcome } = await event.userChoice;

      if (outcome === 'dismissed') return;

      addEventListener('appinstalled', () => setDeferredPromptEvent(null));
    }
  }

  return <Show when={deferredPromptEvent()}>
    <button class="ml-auto" onClick={triggerEvent}>
     <Icon icon="install_desktop" /> Install
    </button>
  </Show>
}
