import './style.css'
import { render } from 'solid-js/web';
import App from './app.tsx';
import './utils/string.extensions.ts';
import './utils/array.extensions.ts';
import './utils/canvas-rendering-context.extensions.ts';
import { Logger } from './utils/Logger.ts';

const logger = new Logger('Main');
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js', { scope: '/'})
    .then(() => logger.debug('Service worker registration succeeded'))
    .catch((error) => logger.warn(`Service worker registration failed: ${error}`));
} else {
  logger.warn('Service workers are not supported.');
}

render(() => <App/>, document.getElementById('root')!);
