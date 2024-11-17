import { Layer } from '../../types/core.type.ts';
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

  public onInit(): void {
    super.onInit();
    this.initializeListeners();
  }

  private initializeListeners(): void {
    this.canvas.addEventListener('click', (event: MouseEvent): void => {
      if (this.points.length === 1) {
        this.points.push(Point.fromEvent(event));
        const layer = this.tryCreateLayer();
        if (layer) {
          this.layerFacade.pushLayer(layer);
        }
        this.reset();
        this.initializeListeners();
      } else {
        this.points.push(Point.fromEvent(event));
      }
    }, { signal: this.abortController.signal});

    this.canvas.addEventListener('mousemove', (event: MouseEvent): void => {
      if (this.points.length === 0) return;
      this.tempPoint = Point.fromEvent(event);
      this.render();
    }, { signal: this.abortController.signal });
  }

  protected render(): void {
    super.render();
    this.ctx.fillStyle = this.colour;
    this.ctx.fill(createRectPathFromPoints(this.points[0], this.tempPoint!));
  }

  public tryCreateLayer(): Layer | null {
    if (this.points.length !== 2) return null;

    const path = createRectPathFromPoints(...this.points as [Point, Point]);
    return {
      tool: 'rect',
      draw: () => {
        this.ctx.fillStyle = this.colour;
        this.ctx.fill(path);
      }
    }
  }

  protected override reset(): void {
    super.reset();
    this.points = [];
    this.tempPoint = null;
  }
}
