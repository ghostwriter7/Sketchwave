import { ToolHandler } from './ToolHandler.ts';
import type { ToolState } from './ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { Point } from '../primitives/Point.ts';
import { createRectPathFromPoints } from '../../shapes/rectangle.ts';

export class RectTool extends ToolHandler {
  private points: Point[] = [];
  private tempPoint: Point | null = null;

  constructor(ctx: CanvasRenderingContext2D, toolState: ToolState, layerFacade: LayerFacade) {
    super(ctx, toolState, layerFacade);
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
      this.render();
    });
  }

  protected render(): void {
    super.render();
    this.ctx.fillStyle = this.colour;
    this.ctx.fill(createRectPathFromPoints(this.points[0], this.tempPoint!));
  }

  public tryCreateLayer(): void {
    if (this.points.length !== 2) return;

    const path = createRectPathFromPoints(...this.points as [Point, Point]);
    const layer = {
      tool: 'rect',
      draw: () => {
        this.ctx.fillStyle = this.colour;
        this.ctx.fill(path);
      }
    }

    if (layer) this.layerFacade.pushLayer(layer);
  }

  protected override reset(): void {
    super.reset();
    this.points = [];
    this.tempPoint = null;
  }
}
