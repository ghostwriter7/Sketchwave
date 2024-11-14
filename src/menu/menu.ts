import type { Coordinates } from '../types/core.type.ts';
import { drawFilledTriangle } from '../shapes/paths.ts';

const menu = document.getElementById('menu') as HTMLElement;
const triangleFillBtn = document.getElementById('triangle-fill')!;

const initializeMenu = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  let abortController: AbortController | null = null;

  menu.addEventListener('click', ({ target }) => {
    abortController?.abort();
    abortController = new AbortController();
    const { signal } = abortController;

    switch (target) {
      case triangleFillBtn: {
        handleTriangleFillAction(canvas, ctx, signal);
        break;
      }
    }
  });
}

const handleTriangleFillAction = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, signal: AbortSignal) => {
  const trianglePoints = [] as Coordinates[];
  canvas.addEventListener('click', (event: MouseEvent) => {
    const { clientX, clientY } = event;
    trianglePoints.push([clientX, clientY] as Coordinates);
    if (trianglePoints.length === 3) {
      drawFilledTriangle(ctx, {
        color: 'blue',
        points: trianglePoints as [Coordinates, Coordinates, Coordinates]
      });
      trianglePoints.length = 0;
    }
  }, { signal });
}

export default initializeMenu;
