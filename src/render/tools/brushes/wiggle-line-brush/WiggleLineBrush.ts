import { SimpleBrush } from '../../abstract/SimpleBrush.ts';
import type { ToolState } from '../../models/ToolState.ts';
import { type LayerFacade } from '../../../LayerFacade.ts';
import { calculateDistance } from '../../../../math/distance.ts';
import { Point } from '../../../../types/Point.ts';
import { Vec2 } from '../../../../types/Vec2.ts';

export class WiggleLineBrush extends SimpleBrush {

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }

  public tryCreateLayer(): void {
    if (this.points.length < 2) return;

    const points = this.points;

    this.createLayer((ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      for (let i = 1; i < points.length; i++) {
        const currentPoint = points.at(i)!;
        const previousPoint = points[i - 1];
        WiggleLineBrush.drawWiggleLineBetweenTwoPoints(ctx, previousPoint, currentPoint, i % 2 == 0);
      }
    });
  }

  protected resetState(): void {
    super.resetState();
    this.ctx.beginPath();
  }

  protected override renderPreview(): void {
    if (this.points.length < 2) return;

    const currentPoint = this.points.at(-1)!;
    const previousPoint = this.points[this.lastPointIndex];

    WiggleLineBrush.drawWiggleLineBetweenTwoPoints(this.ctx, previousPoint, currentPoint, this.lastPointIndex % 2 == 0);
    this.lastPointIndex++;
  }

  private static drawWiggleLineBetweenTwoPoints(ctx: CanvasRenderingContext2D, previousPoint: Point, currentPoint: Point, clockwise: boolean): void {
    const distance = calculateDistance(currentPoint, previousPoint);
    const radius = distance / 2;
    const midPoint = Point.midPoint(currentPoint, previousPoint);

    const midPointVec = new Vec2(midPoint.x - previousPoint.x, midPoint.y - previousPoint.y);

    const perpVec = (clockwise ? midPointVec.cwPerp() : midPointVec.ccwPerp()).scale(6);

    const controlX = midPoint.x + perpVec.x;
    const controlY = midPoint.y + perpVec.y;

    ctx.arcTo(controlX, controlY, currentPoint.x, currentPoint.y, radius)
    ctx.stroke();
  }
}
