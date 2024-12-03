import type { ToolState } from '../../models/ToolState.ts';
import { type LayerFacade } from '../../../LayerFacade.ts';
import { SimpleBrush } from '../../abstract/SimpleBrush.ts';
import { Point } from '../../../../types/Point.ts';
import { createRandomPoints } from '../../../../math/create-random-points-in-circle.ts';

export class AirbrushTool extends SimpleBrush {
  protected override cursorSize = this.size + 2;
  protected override customCursorCreateFn = (ctx: OffscreenCanvasRenderingContext2D) => {
    ctx.strokeStyle = this.colour;
    const center = this.cursorSize / 2;
    ctx.arc(center, center, this.size / 2, 0, 2 * Math.PI);
    ctx.stroke();
  };

  private randomPoints: Point[][] = [];
  private randomPointsCount = this.size * 2;

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }

  public tryCreateLayer(): void {
    if (this.randomPoints.length === 0) return;

    const randomPoints = this.randomPoints;
    const path = new Path2D();
    randomPoints.flat().forEach(({ x , y }) => path.rect(x, y, 1, 1));
    this.createLayer((ctx: CanvasRenderingContext2D) => ctx.fill(path));
  }

  protected override resetState(): void {
    super.resetState();
    this.randomPoints = [];
  }

  protected renderPreview(): void {
    this.ctx.beginPath();
    const point = this.points[this.lastPointIndex];
    const points = createRandomPoints(point, this.halfSize, this.randomPointsCount);
    points.forEach(({ x, y }) => this.ctx.rect(x, y, 1, 1));
    this.randomPoints.push(points);
    this.ctx.fill()
    this.lastPointIndex++;
  }
}
