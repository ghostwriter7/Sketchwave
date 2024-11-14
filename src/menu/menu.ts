import type { Coordinates } from '../types/core.type.ts';
import { drawFilledCircle, drawFilledTriangle, drawStrokedTriangle } from '../shapes/paths.ts';
import { drawFilledRectangle, drawRoundedRectangle, drawStrokedRectangle } from '../shapes/rectangle.ts';

const menu = document.getElementById('menu') as HTMLElement;

const handleTriangleFillAction = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, signal: AbortSignal) => {
  const trianglePoints = [] as Coordinates[];
  canvas.addEventListener('click', (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    trianglePoints.push([offsetX, offsetY] as Coordinates);
    if (trianglePoints.length === 3) {
      drawFilledTriangle(ctx, {
        color: 'blue',
        points: trianglePoints as [Coordinates, Coordinates, Coordinates]
      });
      trianglePoints.length = 0;
    }
  }, { signal });
}

const handleTriangleStrokeAction = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, signal: AbortSignal) => {
  const trianglePoints = [] as Coordinates[];
  canvas.addEventListener('click', (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    trianglePoints.push([offsetX, offsetY] as Coordinates);
    if (trianglePoints.length === 3) {
      drawStrokedTriangle(ctx, {
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
      const { offsetX, offsetY } = event;
      circlePoints.push([offsetX, offsetY] as Coordinates);
      if (circlePoints.length === 2) {
        drawFilledCircle(ctx, { color: 'pink', points: circlePoints as [Coordinates, Coordinates] });
        circlePoints.length = 0;
      }
    }, { signal });
}

const handleRectAction = (type: 'fill' | 'stroke' | 'round') =>
  (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, signal: AbortSignal) => {
      let origin: Coordinates | null;
      canvas.addEventListener('click', (event: MouseEvent) => {
        const { offsetX, offsetY } = event;
        if (!origin) {
          origin = [offsetX, offsetY];
        } else {
          const width = Math.abs(offsetX - origin[0])
          const height = Math.abs(offsetY - origin[1]);
          const x = Math.min(offsetX, origin[0]);
          const y = Math.min(offsetY, origin[1]);
          const options = {
            color: 'blue',
            origin: [x, y],
            dimensions: [width, height]
          };
          switch (type) {
            case 'fill':
              drawFilledRectangle(ctx, options);
              break;
            case 'stroke':
              drawStrokedRectangle(ctx, options);
              break;
            case 'round':
              drawRoundedRectangle(ctx, options);
              break;
          }
          origin = null;

        }
      }, { signal})
  }

const actionMap: Record<string, (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, signal: AbortSignal) => void> = {
  triangleFill: handleTriangleFillAction,
  triangleStroke: handleTriangleStrokeAction,
  circleFill: handleCircleFillAction,
  rectFill: handleRectAction('fill'),
  rectStroke: handleRectAction('stroke'),
  rectRound: handleRectAction('round')
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
