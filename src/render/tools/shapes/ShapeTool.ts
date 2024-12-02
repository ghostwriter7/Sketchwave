import { ToolHandler } from '../abstract/ToolHandler.ts';
import type { ToolState } from '../models/ToolState.ts';
import { type LayerFacade } from '../../LayerFacade.ts';
import { Point } from '../../primitives/Point.ts';
import { rect } from './point-factories/rect.ts';

export class ShapeTool extends ToolHandler {
  private startPoint: Point | null = null;
  private endPoint: Point | null = null;
  private isWorking = false;

  private readonly pointFactory: (origin: Point, endPoint: Point) => Point[];

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
    this.pointFactory = rect;
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

    const points = this.pointFactory(this.startPoint, this.endPoint);

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(({ x, y }) => this.ctx.lineTo(x, y));
    this.ctx.closePath();
    this.ctx.fill();
  }

  private resetState(): void {
    if (!this.isWorking) return;
    this.tryCreateLayer();
    this.startPoint = null;
    this.endPoint = null;
  }
}
