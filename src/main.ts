import './style.css'
import initializeMenu from './menu/menu.ts';
import { drawTransparencyDemo } from './demos/transparency.ts';
import { initializeLineThicknessPicker } from './menu/line-thickness-picker.ts';
import { LayerStore } from './store/layer.store.ts';

const canvas = document.getElementById('app') as HTMLCanvasElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;

window.ctx = ctx;
window.canvas = canvas;

const layerStore = new LayerStore();
const drawLayers = () =>
  layerStore.layers.forEach((layer) => layer.draw(ctx));


const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLayers();
  requestAnimationFrame(render)
}

render();

initializeLineThicknessPicker();
initializeMenu(canvas, ctx, layerStore);

drawTransparencyDemo(ctx);
