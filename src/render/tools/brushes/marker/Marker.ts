import { SimpleBrush } from '../../abstract/SimpleBrush.ts';
import type { ToolState } from '../../models/ToolState.ts';
import { type LayerFacade } from '../../../LayerFacade.ts';
import { calculateDistance } from '../../../../math/distance.ts';
import type { Point } from '../../../primitives/Point.ts';
import { renderCircles } from '../../../utils/render-circles.ts';
import { stringifyRgb } from '../../../../color/stringify-rgb.ts';

export class Marker extends SimpleBrush {
  protected override cursorSize = this.size + 2;
  protected override customCursorCreateFn = (ctx: OffscreenCanvasRenderingContext2D) => {
    ctx.fillStyle = stringifyRgb(this.toolState.color, 0.25);
    const center = this.cursorSize / 2;
    ctx.arc(center, center, this.size / 2, 0, 2 * Math.PI);
    ctx.fill();
  };

  protected override onNewPoint = (point: Point): void => {
    if (!this.points.length) {
      this.points.push(point);
    } else {
      const prevPoint = this.points.at(-1)!;
      const distance = calculateDistance(prevPoint, point);
      if (distance > 1) {
        const dx = point.x - prevPoint.x;
        const dy = point.y - prevPoint.y;
        const normalizedVec = [dx / distance, dy / distance];
        const count = Math.floor(distance);

        const midPoints = Array.from({ length: count }, (_, i) => ({
          x: prevPoint.x + normalizedVec[0] * (i + 1),
          y: prevPoint.y + normalizedVec[1] * (i + 1),
        }));

        this.points.push(...midPoints);
      } else {
        this.points.push(point);
      }
    }

    this.renderPreview();
  }

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super({ ...toolState, fillStyle: stringifyRgb(toolState.color, 0.01) }, layerFacade);
  }

  public tryCreateLayer(): void {
    if (this.points.length == 0) return;
    const points = this.points;
    const radius = this.halfSize;
    this.createLayer((ctx: CanvasRenderingContext2D) => renderCircles(ctx, points, radius));
  }

  protected override renderPreview(): void {
    if (this.points.length < 1) return;

    renderCircles(this.ctx, this.points, this.halfSize, this.lastPointIndex);
    this.lastPointIndex = this.points.length - 1;
  }
}
