import './style.css'
import { render } from 'solid-js/web';
import App from './app.tsx';
import './helpers/string.ts';

render(() => <App/>, document.getElementById('root')!);
