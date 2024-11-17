import type { Coordinates } from '../types/core.type.ts';
import type { LayerFacade } from '../global-provider.tsx';
import { createRectPathFromPoints } from '../shapes/rectangle.ts';
import type { ToolHandler } from '../types/tool-handler.type.ts';

export const handleRectangleTool: ToolHandler = (layerFacade: LayerFacade, clicks: Coordinates[], mousePosition?: Coordinates
) => {
  if (clicks.length === 0) return;

  if (clicks.length === 1 && mousePosition) {
    const path = createRectPathFromPoints(clicks[0], mousePosition);
    layerFacade.setTemporaryLayer({ draw: (ctx: CanvasRenderingContext2D) => ctx.fill(path) });
  } else {
    const path = createRectPathFromPoints(clicks[0], clicks[1]);
    layerFacade.insertLayer({ draw: (ctx: CanvasRenderingContext2D) => ctx.fill(path) });
    layerFacade.resetCoordinates()
  }
}
