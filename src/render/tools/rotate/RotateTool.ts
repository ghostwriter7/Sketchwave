import { ToolHandler } from '../abstract/ToolHandler.ts';
import type { ToolState } from '../models/ToolState.ts';
import { type LayerFacade } from '../../LayerFacade.ts';

export abstract class RotateTool extends ToolHandler {
  protected constructor(toolState: ToolState, layerFacade: LayerFacade, private readonly clockwise: boolean) {
    super(toolState, layerFacade);

    const imageData = this.createRotatedImageData();
    this.createLayer((ctx: CanvasRenderingContext2D) => {
      ctx.putImageData(imageData, 0, 0);
    });
    this.layerFacade.renderLayers();
    this.deactivate();
  }

  protected createRotatedImageData(): ImageData {
    const clockwise = this.clockwise;
    const currentImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    const width = this.width;
    const height = this.height;
    const newWidth = height;
    const newHeight = width;

    this.newHeight = newHeight;
    this.newWidth = newWidth;

    const newImageData = new ImageData(newWidth, newHeight);

    const sourceData = currentImageData.data;
    const targetData = newImageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sourceIndex = (y * width + x) * 4;
        let targetX, targetY;

        if (clockwise) {
          targetY = x;
          targetX = height - y - 1;
        } else {
          targetY = width - x - 1;
          targetX = y;
        }

        const targetIndex = (targetY * newWidth + targetX) * 4;

        targetData[targetIndex] = sourceData[sourceIndex];
        targetData[targetIndex + 1] = sourceData[sourceIndex + 1];
        targetData[targetIndex + 2] = sourceData[sourceIndex + 2];
        targetData[targetIndex + 3] = sourceData[sourceIndex + 3];
      }
    }

    return newImageData;
  }
}
