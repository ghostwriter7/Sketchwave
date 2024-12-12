import './style.css'
import { render } from 'solid-js/web';
import App from './app.tsx';
import './utils/string.extensions.ts';
import './utils/array.extensions.ts';
import './utils/canvas-rendering-context.extensions.ts';

render(() => <App/>, document.getElementById('root')!);
