import './style.css'
import initializeMenu from './menu/menu.ts';
import { drawTransparencyDemo } from './demos/transparency.ts';
import { initializeLineThicknessPicker } from './menu/line-thickness-picker.ts';

const canvas = document.getElementById('app') as HTMLCanvasElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;

window.ctx = ctx;
window.canvas = canvas;

initializeLineThicknessPicker();
initializeMenu(canvas, ctx);

drawTransparencyDemo(ctx);
