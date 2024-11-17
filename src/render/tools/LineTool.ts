import { Layer } from '../../types/core.type.ts';
import { ToolHandler } from './ToolHandler.ts';
import type { ToolState } from './ToolState.ts';
import { Point } from '../primitives/Point.ts';
import type { LayerFacade } from '../LayerFacade.ts';

/**
 * A Line Tool is used for drawing straight lines between points
 * derived from user's mouse clicks.
 */
export class LineTool extends ToolHandler {
  private points: Point[] = [];
  private previewOnlyPoint: Point | null = null;

  constructor(
    ctx: CanvasRenderingContext2D,
    toolState: ToolState,
    layerFacade: LayerFacade
  ) {
    super(ctx, toolState, layerFacade);
  }

  public override onInit(): void {
    super.onInit();
    this.initializeListeners();
  }

  public tryCreateLayer(): Layer | null {
    if (this.points.length === 0) return null;

    const path = this.createPath();
    return {
      tool: LineTool.name.toUpperCase(),
      draw: () => this.renderPath(path),
    }
  }

  protected override render(): void {
    super.render();
    const path = this.createPath();
    path.lineTo(this.previewOnlyPoint!.x, this.previewOnlyPoint!.y);
    this.renderPath(path);
  }

  private initializeListeners(): void {
    this.logger.log('Initializing listeners.');

    this.canvas.addEventListener('click', this.addPointFromEvent.bind(this), { signal: this.abortController.signal });

    this.canvas.addEventListener('mousemove', (event) => {
      if (this.points.length > 0) {
        this.previewOnlyPoint = Point.fromEvent(event);
        this.render();
      }
    }, { signal: this.abortController.signal });

    this.canvas.addEventListener('dblclick', (event) => {
      this.addPointFromEvent(event);
      this.render();

      const layer = this.tryCreateLayer();
      if (layer) this.layerFacade.pushLayer(layer);

      this.reset();
      this.initializeListeners();
    }, { signal: this.abortController.signal });
  }

  private reset(): void {
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

  private renderPath(path: Path2D): void {
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.colour;
    this.ctx.stroke(path);
  }
}
