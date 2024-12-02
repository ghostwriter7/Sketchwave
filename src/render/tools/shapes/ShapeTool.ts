import { ToolHandler } from '../abstract/ToolHandler.ts';
import type { ToolState } from '../models/ToolState.ts';
import { type LayerFacade } from '../../LayerFacade.ts';
import { Point } from '../../primitives/Point.ts';
import { rect } from './get-points-for-shape-fns/rect.ts';
import { computePointsForRoundedShape } from './compute-points-for-rounded-shape.ts';

export class ShapeTool extends ToolHandler {
  private startPoint: Point | null = null;
  private endPoint: Point | null = null;
  private isWorking = false;

  private readonly getPointsForShapeFn: (origin: Point, endPoint: Point) => Point[];

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
    this.getPointsForShapeFn = rect;
  }

  public tryCreateLayer(): void {
  }

  protected initializeListeners(): void {
    this.onMouseDown((event) => {
      this.isWorking = true;
      this.startPoint = Point.fromEvent(event);
    });

    this.onMove((event) => {
      this.endPoint = Point.fromEvent(event);
      this.renderPreview();
    });

    const reset = () => this.resetState();
    this.onMouseUp(reset);
    this.onMouseLeave(reset);
  }

  protected renderPreview(): void {
    if (!this.startPoint || !this.endPoint) return;
    super.renderPreview();

    const points = this.getPointsForShapeFn(this.startPoint, this.endPoint);

    if (this.toolState.toolProperties?.isRounded) {
      const dx = this.endPoint.x - this.startPoint.x;
      const dy = this.endPoint.y - this.startPoint.y;

      const { chunks, radius } = computePointsForRoundedShape(points, Math.abs(dx), Math.abs(dy));
      this.ctx.beginPath();

      for (let i = 0; i < chunks.length; i++) {
        const [startPoint, testPoint, endPoint] = chunks[i];

        if (i == 0) {
          this.ctx.moveTo(startPoint.x, startPoint.y);
        } else {
          this.ctx.lineTo(startPoint.x, startPoint.y)
        }

        this.ctx.arcTo(testPoint.x, testPoint.y, endPoint.x, endPoint.y, radius);
      }

      this.ctx.closePath();
      this.ctx.fill();

    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach(({ x, y }) => this.ctx.lineTo(x, y));
      this.ctx.closePath();
      this.ctx.fill();
    }

  }

  private resetState(): void {
    if (!this.isWorking) return;
    this.tryCreateLayer();
    this.startPoint = null;
    this.endPoint = null;
  }
}
