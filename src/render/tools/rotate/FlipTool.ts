import { ToolHandler } from '../abstract/ToolHandler.ts';
import type { ToolState } from '../models/ToolState.ts';
import type { LayerFacade } from '../../LayerFacade.ts';

export abstract class FlipTool extends ToolHandler {

  protected constructor(toolState: ToolState, layerFacade: LayerFacade,
              private readonly calculateTargetIndex: (x: number, y: number, width: number, height: number) => number) {
    super(toolState, layerFacade);

    const imageData = this.createFlippedImageData();
    this.createLayer((ctx: CanvasRenderingContext2D) => {
      ctx.putImageData(imageData, 0, 0);
    });
    this.layerFacade.renderLayers();
    this.deactivate();
  }

  protected createFlippedImageData(): ImageData {
    const currentImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    const newImageData = new ImageData(this.width, this.height);

    const sourceData = currentImageData.data;
    const targetData = newImageData.data;

    const height = this.height;
    const width = this.width;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sourceIndex = (y * width + x) * 4;
        const targetIndex = this.calculateTargetIndex(x, y, width, height);

        targetData[targetIndex] = sourceData[sourceIndex];
        targetData[targetIndex + 1] = sourceData[sourceIndex + 1];
        targetData[targetIndex + 2] = sourceData[sourceIndex + 2];
        targetData[targetIndex + 3] = sourceData[sourceIndex + 3];
      }
    }

    return newImageData;
  }
}
