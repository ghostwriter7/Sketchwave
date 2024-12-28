import type { ToolState } from '../../models/ToolState.ts';
import { type LayerFacade } from '../../../LayerFacade.ts';
import { SimpleBrush } from '../../abstract/SimpleBrush.ts';
import { createSimpleDotCursor } from '../cursors/simple-dot.ts';
import { calculateDistance } from '../../../../math/distance.ts';
import { Point } from '../../../../types/Point.ts';

export class BeadsBrush extends SimpleBrush {
  protected readonly cursorSize = 10;

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
    this.customCursorCreateFn = createSimpleDotCursor(this.colour, 10);
  }

  protected tryCreateLayer = () => {
    if (this.points.length < 2) return;

    const points = this.points;
    this.createLayer((ctx: CanvasRenderingContext2D) => {
      for (let i = 1; i < points.length; i++) {
        const previousPoint = points[i];
        const currentPoint = points[i - 1]!;
        BeadsBrush.renderCircleBetweenTwoPoints(ctx, previousPoint, currentPoint);
      }
    })
  }

  protected override renderPreview(): void {
    if (this.points.length < 2) return;
    const previousPoint = this.points[this.lastPointIndex];
    const currentPoint = this.points.at(-1)!;
    BeadsBrush.renderCircleBetweenTwoPoints(this.ctx, previousPoint, currentPoint);
    this.lastPointIndex++;
  }

  private static renderCircleBetweenTwoPoints(ctx: CanvasRenderingContext2D, previousPoint: Point, currentPoint: Point): void {
    const radius = Math.ceil(calculateDistance(previousPoint, currentPoint) / 2);
    const midPoint = Point.midPoint(previousPoint, currentPoint);

    ctx.beginPath();
    ctx.arc(midPoint.x, midPoint.y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

}
