import type { Coordinates } from '../types/core.type.ts';
import { createRectPathFromPoints } from '../shapes/rectangle.ts';

export const handleSelectTool = (layerFacade: LayerFacade, clicks: Coordinates[], mousePosition?: Coordinates): void => {
  if (clicks.length === 0) return;

  if (clicks.length === 1 && mousePosition) {
    const path = createRectPathFromPoints(clicks[0], mousePosition);
    layerFacade.setTemporaryLayer({
      draw: (ctx: CanvasRenderingContext2D) => {
        ctx.setLineDash([4, 2]);
        ctx.lineDashOffset = 2;
        ctx.stroke(path)
      }
    });
  } else {
    const path = createRectPathFromPoints(clicks[0], clicks[1]);
    let dashOffset = 0;
    setInterval(() => {
      dashOffset++;
      if (dashOffset > 5) {
        dashOffset = 0;
      }
    }, 20);
    layerFacade.insertLayer({
      draw: (ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = 'black';
        ctx.setLineDash([4, 2]);
        ctx.lineDashOffset = dashOffset;
        ctx.stroke(path);
      }
    });
    layerFacade.resetCoordinates();
  }
}
