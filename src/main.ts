import './style.css'
import initializeMenu from './menu/menu.ts';
import { drawCircles } from './demos/circles.ts';

const canvas = document.getElementById('app') as HTMLCanvasElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;

window.ctx = ctx;
window.canvas = canvas;

initializeMenu(canvas, ctx);

drawCircles(ctx);
