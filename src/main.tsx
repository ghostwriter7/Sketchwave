import './style.css'
import { render } from 'solid-js/web';
import './utils/string.extensions.ts';
import './utils/array.extensions.ts';
import './utils/canvas-rendering-context.extensions.ts';
import { Logger } from './utils/Logger.ts';
import { isDevMode } from './utils/environment.ts';
import { Router } from '@solidjs/router';
import { routes } from './routes.ts';

const logger = new Logger('Main');

if (!isDevMode()) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js', { scope: '/' })
      .then(() => logger.debug('Service worker registration succeeded'))
      .catch((error) => logger.warn(`Service worker registration failed: ${error}`));
  } else {
    logger.warn('Service workers are not supported.');
  }
} else {
  logger.debug('Running in development mode, skipping service worker registration.');

  if ('serviceWorker' in navigator) {
    logger.debug('Unregistering service worker.');
    const registration = await navigator.serviceWorker.getRegistration('/');
    registration?.unregister();
  }
}

render(() => <Router>{routes}</Router>, document.getElementById('root')!);
