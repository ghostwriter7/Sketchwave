import './style.css'
import { clearRect, drawFilledRectangle, drawImageFrame, drawStrokedRectangle } from "./shapes/rectangle.ts";
import type { Coordinates } from "./types/core.type.ts";
import { drawFilledTriangle } from "./shapes/paths.ts";

const canvas = document.getElementById('app') as HTMLCanvasElement;
const triangleBtn = document.getElementById('triangle')!;

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

let controller: AbortController | null = null;
triangleBtn.addEventListener('click', () => {
  controller?.abort();
  controller = new AbortController()
  const { signal } = controller;

  const trianglePoints = [] as Coordinates[];
  canvas.addEventListener('click', (event: MouseEvent) => {
    const { clientX, clientY } = event;
    trianglePoints.push([clientX, clientY] as Coordinates);
    if (trianglePoints.length === 3) {
      drawFilledTriangle(ctx, { color: 'blue', points: trianglePoints as [Coordinates, Coordinates, Coordinates] });
      trianglePoints.length = 0;
    }
  }, { signal });
});

