import { ToolHandler } from './abstract/ToolHandler.ts';
import type { ToolState } from './models/ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { Point } from '../../types/Point.ts';
import { createRectPathFromPoints } from '../../shapes/rectangle.ts';

export class RectTool extends ToolHandler {
  private points: Point[] = [];
  private tempPoint: Point | null = null;

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }

  protected initializeListeners(): void {
    this.onClick((event: MouseEvent): void => {
      if (this.points.length === 1) {
        this.points.push(Point.fromEvent(event));
        this.tryCreateLayer();
        this.reset();
        this.initializeListeners();
      } else {
        this.points.push(Point.fromEvent(event));
      }
    });

    this.onMove((event: MouseEvent): void => {
      if (this.points.length === 0) return;
      this.tempPoint = Point.fromEvent(event);
      this.renderPreview();
    });
  }

  protected renderPreview(): void {
    super.renderPreview();
    this.ctx.fill(createRectPathFromPoints(this.points[0], this.tempPoint!));
  }

  public tryCreateLayer(): void {
    if (this.points.length !== 2) return;

    const path = createRectPathFromPoints(...this.points as [Point, Point]);
    this.createLayer((ctx: CanvasRenderingContext2D) => ctx.fill(path)
    );
  }

  protected override reset(): void {
    super.reset();
    this.points = [];
    this.tempPoint = null;
  }
}
