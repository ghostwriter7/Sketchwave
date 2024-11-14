import type { Coordinates } from '../types/core.type.ts';
import { drawFilledCircle, drawFilledTriangle } from '../shapes/paths.ts';

const menu = document.getElementById('menu') as HTMLElement;

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

const handleCircleFillAction = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, signal: AbortSignal) => {
    const circlePoints = [] as Coordinates[];
    canvas.addEventListener('click', (event: MouseEvent) => {
      const { clientX, clientY } = event;
      circlePoints.push([clientX, clientY] as Coordinates);
      if (circlePoints.length === 2) {
        drawFilledCircle(ctx, { color: 'pink', points: circlePoints as [Coordinates, Coordinates] });
        circlePoints.length = 0;
      }
    })
}

const actionMap: Record<string, (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, signal: AbortSignal) => void> = {
  triangleFill: handleTriangleFillAction,
  circleFill: handleCircleFillAction,
}

const initializeMenu = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  let abortController: AbortController | null = null;

  menu.addEventListener('click', ({ target }) => {
    abortController?.abort();
    abortController = new AbortController();
    const { signal } = abortController;
    const actionId = (target as HTMLButtonElement).id;
    actionMap[actionId](canvas, ctx, signal);
  });
}

export default initializeMenu;
