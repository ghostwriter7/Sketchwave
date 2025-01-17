import { ToolHandler } from './abstract/ToolHandler.ts';
import type { ToolState } from './models/ToolState.ts';
import { Point } from '../../types/Point.ts';
import type { LayerFacade } from '../LayerFacade.ts';

/**
 * A Line Tool is used for drawing straight lines between points
 * derived from user's mouse clicks.
 */
export class LineTool extends ToolHandler {
  private points: Point[] = [];
  private previewOnlyPoint: Point | null = null;

  constructor(
    toolState: ToolState,
    layerFacade: LayerFacade
  ) {
    super({ ...toolState, lineJoin: 'round', lineCap: 'round' }, layerFacade);
  }

  protected tryCreateLayer = () => {
    if (this.points.length <= 1) return;

    const path = this.createPath();
    this.createLayer((ctx: CanvasRenderingContext2D) => ctx.stroke(path));
  }

  protected override renderPreview(): void {
    super.renderPreview();
    const path = this.createPath();
    path.lineTo(this.previewOnlyPoint!.x, this.previewOnlyPoint!.y);
    this.ctx.stroke(path);  }

  protected initializeListeners(): void {
    this.onClick(this.addPointFromEvent.bind(this));

    this.onMove((event) => {
      if (this.points.length > 0) {
        this.previewOnlyPoint = Point.fromEvent(event);
        this.renderPreview();
      }
    });

    this.onDoubleClick((event) => {
      this.addPointFromEvent(event);
      this.renderPreview();
      this.tryCreateLayer();
      this.reset();
      this.initializeListeners();
    });
  }

  protected override reset(): void {
    super.reset();
    this.points = [];
    this.previewOnlyPoint = null;
  }

  private addPointFromEvent(event: MouseEvent): void {
    this.points = [...this.points, Point.fromEvent(event)];
  }

  private createPath(): Path2D {
    const path = new Path2D();
    this.points.forEach(({ x, y }, index) =>
      index === 0 ? path.moveTo(x, y) : path.lineTo(x, y));
    return path;
  }
}
