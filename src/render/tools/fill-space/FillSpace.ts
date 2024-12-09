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
    const queue = [[startPoint.x, startPoint.y]] as [number, number][];
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const array = new Uint8ClampedArray(imageData.data.buffer);
    const [red, green, blue] = this.toolState.color;

    const width = this.width;
    const height = this.height;

    const visitedPoints = new Uint8Array(width * height);

    const isVisited = (index: number) => visitedPoints[index] == 1

    const targetColorAsDigit =
      (targetColor.data[0] << 24) |
      (targetColor.data[1] << 16) |
      (targetColor.data[2] << 8) |
      targetColor.data[3];

    console.time('LOOP')
    while (queue.length > 0) {
      const [x, y] = queue.shift()!;

      const rawIndex = y * width + x;
      const index = rawIndex * 4;

      if (isVisited(rawIndex)) continue;

      visitedPoints[rawIndex] = 1

      const currentPixelColor =
        (imageData.data[index] << 24) |
        (imageData.data[index + 1] << 16) |
        (imageData.data[index + 2] << 8) |
        imageData.data[index + 3];

      if (currentPixelColor == targetColorAsDigit) {
        array[index] = red;
        array[index + 1] = green;
        array[index + 2] = blue;
        array[index + 3] = 255;

        for (const [dx, dy] of this.vectorsForSiblingPoints) {
          const point = [x + dx, y + dy] as [number, number];

          if (
            point[0] >= 0 &&
            point[0] <= width &&
            point[1] >= 0 &&
            point[1] <= height) {
            queue.push(point);
          }
        }
      }


    }
    console.timeEnd('LOOP')

    this.ctx.putImageData(new ImageData(array, width, height), 0, 0);
  }

}
