import type { KeyboardShortcuts } from '../types/core.type.ts';
import { Logger } from './Logger.ts';

export class EventService {
  private readonly logger = new Logger(EventService.name);
  private readonly abortController = new AbortController();

  constructor(private readonly keyboardShortcuts: KeyboardShortcuts) {
  }

  public listen(): void {
    document.addEventListener('keydown', (event) => {
      const { code, ctrlKey, shiftKey } = event;
      const matchingActionKey = Object.entries(this.keyboardShortcuts).find(([_, value]) => {
        if (typeof value === 'string') {
          return code === value && !ctrlKey;
        }
        return value.key === code && (!value.ctrl || ctrlKey) && (!value.shift || shiftKey);
      })?.[0];

      if (matchingActionKey) {
        this.logger.debug(`Received a keyboard action for: ${matchingActionKey}`);

        if (matchingActionKey == 'cancel') {
          (document.activeElement as HTMLElement)?.blur();
        } else {
          event.preventDefault();
          const element = document.getElementById(matchingActionKey) || document.querySelector(`[data-tool="${matchingActionKey}"]`);
          element?.click();
          element?.focus();
        }
      }
    }, { signal: this.abortController.signal});
  }

  public destroy(): void {
    this.abortController.abort();
  }
}
