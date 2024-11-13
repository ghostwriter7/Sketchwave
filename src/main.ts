import './style.css'
import drawRectangle from "./shapes/draw-rectangle.ts";

const canvas = document.getElementById('app') as HTMLCanvasElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;

window.ctx = ctx;
window.canvas = canvas;

drawRectangle(ctx, "green", [20, 40], [300, 100]);
drawRectangle(ctx, "rgb(0 0 200 / 50%)", [200, 50], [100, 100]);
