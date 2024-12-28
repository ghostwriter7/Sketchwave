import { SimpleBrush } from '../../abstract/SimpleBrush.ts';
import type { ToolState } from '../../models/ToolState.ts';
import { type LayerFacade } from '../../../LayerFacade.ts';
import { calculateDistance } from '../../../../math/distance.ts';
import { Point } from '../../../../types/Point.ts';
import { Vec2 } from '../../../../types/Vec2.ts';

export class WiggleLineBrush extends SimpleBrush {
  private path = new Path2D();

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade)
  }

  protected tryCreateLayer = () => {
    if (this.points.length < 2) return;

    const path = this.path;
    this.createLayer((ctx: CanvasRenderingContext2D) => ctx.stroke(path));
  }

  protected resetState(): void {
    super.resetState();
    this.path = new Path2D();
  }

  protected override renderPreview(): void {
    if (this.points.length == 1) {
      this.path.moveTo(this.points[0].x, this.points[0].y);
    }

    if (this.points.length < 2) return;
    super.renderPreview();

    const currentPoint = this.points.at(-1)!;
    const previousPoint = this.points[this.lastPointIndex];

    const distance = calculateDistance(currentPoint, previousPoint);
    const radius = distance / 2;
    const midPoint = Point.midPoint(currentPoint, previousPoint);

    const midPointVec = new Vec2(midPoint.x - previousPoint.x, midPoint.y - previousPoint.y);

    const clockwise = this.lastPointIndex % 2 == 0;
    const perpVec = (clockwise ? midPointVec.cwPerp() : midPointVec.ccwPerp()).scale(6);

    const controlX = midPoint.x + perpVec.x;
    const controlY = midPoint.y + perpVec.y;

    this.path.arcTo(controlX, controlY, currentPoint.x, currentPoint.y, radius)
    this.ctx.stroke(this.path);

    this.lastPointIndex++;
  }
}
