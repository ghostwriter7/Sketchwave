import { SimpleBrush } from '../../abstract/SimpleBrush.ts';
import type { ToolState } from '../../models/ToolState.ts';
import { type LayerFacade } from '../../../LayerFacade.ts';
import { calculateDistance } from '../../../../math/distance.ts';
import type { Point } from '../../../../types/Point.ts';
import { renderCircles } from '../../helpers/render-circles.ts';
import { getMidPoints } from '../../../../math/get-mid-points.ts';
import { Color } from '../../../../types/Color.ts';

export class Marker extends SimpleBrush {
  protected override cursorSize = this.size + 2;
  protected override customCursorCreateFn = (ctx: OffscreenCanvasRenderingContext2D) => {
    ctx.fillStyle = new Color(...this.toolState.rgb, 0.25).toString();
    const center = this.cursorSize / 2;
    ctx.arc(center, center, this.size / 2, 0, 2 * Math.PI);
    ctx.fill();
  };

  protected override onNewPoint = (point: Point): void => {
    if (!this.points.length) {
      this.points.push(point);
    } else {
      const prevPoint = this.points.at(-1)!;

      if (calculateDistance(prevPoint, point) > 1) {
        this.points.push(...getMidPoints(prevPoint, point));
      }

      this.points.push(point);
    }

    this.renderPreview();
  }

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super({ ...toolState, fillStyle: new Color(...toolState.rgb, 0.01).toString() }, layerFacade);
  }

  protected tryCreateLayer = () => {
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
