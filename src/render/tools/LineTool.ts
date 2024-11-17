import { Layer } from '../../types/core.type.ts';
import { ToolHandler } from './ToolHandler.ts';
import type { ToolState } from './ToolState.ts';
import { Point } from '../primitives/Point.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { Logger } from '../../utils/Logger.ts';

/**
 * A Line Tool is used for drawing straight lines between points
 * derived from user's mouse clicks.
 */
export class LineTool extends ToolHandler {
  private points: Point[] = [];
  private previewOnlyPoint: Point | null = null;

  private readonly logger = new Logger(LineTool);

  constructor(
    ctx: CanvasRenderingContext2D,
    toolState: ToolState,
    layerFacade: LayerFacade
  ) {
    super(ctx, toolState, layerFacade);
  }

  public onDestroy(): void {
    this.logger.log('Destroying an instance.');
    this.abortController?.abort(`Destroying ${LineTool.name}.`);
  }

  public onInit(): void {
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

      this.abortController.abort('Aborting listeners - double click.');

      this.resetState();
      this.initializeListeners();
    }, { signal: this.abortController.signal });
  }

  private resetState(): void {
    this.abortController = new AbortController();
    this.points = [];
    this.previewOnlyPoint = null;
    this.layerFacade.renderLayers();
    this.refreshSnapshot();
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
