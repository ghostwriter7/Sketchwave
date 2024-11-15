import './style.css'
// import initializeMenu from './menu/menu.ts';
// import { drawTransparencyDemo } from './demos/transparency.ts';
// import { initializeLineThicknessPicker } from './menu/line-thickness-picker.ts';
// import { LayerStore } from './store/layer.store.ts';
import { render } from 'solid-js/web';
import App from './app.tsx';

render(() => <App/>, document.getElementById('root'));

// const layerStore = new LayerStore();
// const drawLayers = () =>
//   layerStore.layers.forEach((layer) => layer.draw(ctx));
//
//
// const render = () => {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   drawLayers();
//   requestAnimationFrame(render)
// }
//
// render();
//
// initializeLineThicknessPicker();
// initializeMenu(canvas, ctx, layerStore);
//
// drawTransparencyDemo(ctx);
