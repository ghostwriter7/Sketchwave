import { ToolHandler } from '../abstract/ToolHandler.ts';
import type { ToolState } from '../models/ToolState.ts';
import { type LayerFacade } from '../../LayerFacade.ts';
import { Point } from '../../../types/Point.ts';

export class FillSpace extends ToolHandler {

  private readonly vectorsForSiblingPoints = [[-1, 1], [0, 1], [1, 1],
    [-1, 0], [1, 0],
    [-1, -1], [0, -1], [1, -1]];

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }

  public tryCreateLayer(): void {
  }

  protected initializeListeners(): void {


    this.onClick((event: MouseEvent): void => {
      const point = Point.fromEvent(event);
      const targetColor = this.ctx.getImageData(point.x, point.y, 1, 1);
      this.processPointsIteratively(targetColor, point);
    });
  }

  private processPointsIteratively(targetColor: ImageData, startPoint: Point): void {
    const width = this.width;
    const height = this.height;
    const firstPointIndex = startPoint.y * width + startPoint.x;

    const stack = [firstPointIndex] as number[];
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const array = new Uint8ClampedArray(imageData.data.buffer);
    const [red, green, blue] = this.toolState.color;
    const visitedPoints = new Uint8Array(width * height);

    const targetColorAsDigit =
      (targetColor.data[0] << 24) |
      (targetColor.data[1] << 16) |
      (targetColor.data[2] << 8) |
      targetColor.data[3];

    const offsets = this.vectorsForSiblingPoints.map(([dx, dy]) => dy * width + dx);

    console.time('LOOP')
    while (stack.length > 0) {
      const rawIndex = stack.pop()!;

      if (visitedPoints[rawIndex] == 1) continue;

      const index = rawIndex * 4;

      visitedPoints[rawIndex] = 1

      const secondIndex = index + 1;
      const thirdIndex = index + 2;
      const fourthIndex = index + 3;

      const currentPixelColor =
        (imageData.data[index] << 24) |
        (imageData.data[secondIndex] << 16) |
        (imageData.data[thirdIndex] << 8) |
        imageData.data[fourthIndex];

      if (currentPixelColor == targetColorAsDigit) {
        array[index] = red;
        array[secondIndex] = green;
        array[thirdIndex] = blue;
        array[fourthIndex] = 255;

        for (const offset of offsets) {
          const neighbourIndex = rawIndex + offset;

          if (neighbourIndex >= 0 && neighbourIndex < visitedPoints.length && !visitedPoints[neighbourIndex]) {
            stack.push(neighbourIndex);
          }
        }
      }


    }
    console.timeEnd('LOOP')

    this.ctx.putImageData(new ImageData(array, width, height), 0, 0);
  }

}
