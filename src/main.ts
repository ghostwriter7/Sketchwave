import './style.css'
import { clearRect, drawFilledRectangle, drawImageFrame, drawStrokedRectangle } from "./shapes/rectangle.ts";

const canvas = document.getElementById('app') as HTMLCanvasElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;

window.ctx = ctx;
window.canvas = canvas;

drawFilledRectangle(ctx, { color: "green", origin: [20, 40], dimensions: [300, 100] });
drawFilledRectangle(ctx, { color: "rgb(0 0 200 / 50%)", origin: [200, 50], dimensions: [100, 100] });

drawStrokedRectangle(ctx, { color: 'red', origin: [100, 50], dimensions: [50, 300] });

clearRect(ctx, { origin: [150, 50], dimensions: [25, 25]})

drawImageFrame(ctx, { color: 'pink', dimensions: [250, 100], origin: [250, 250]});
