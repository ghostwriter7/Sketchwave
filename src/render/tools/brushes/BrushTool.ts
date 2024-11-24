import { ToolHandler } from '../ToolHandler.ts';
import type { ToolState } from '../models/ToolState.ts';
import type { LayerFacade } from '../../LayerFacade.ts';
import { Point } from '../../primitives/Point.ts';

export class BrushTool extends ToolHandler {
  private points: Point[] = [];
  private isDrawing = false;
  private lastPaintedIndex = 0;

  private readonly halfWidth: number;

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super({ ...toolState, lineCap: 'round', lineJoin: 'round' }, layerFacade);
    this.halfWidth = this.lineWidth / 2;
  }

  public tryCreateLayer(): void {
    if (this.points.length === 0) return;

    const points = this.points;
    const halfWidth = this.halfWidth;

    this.createLayer((ctx: CanvasRenderingContext2D) => {
      const [{ x, y }] = points;

      if (points.length === 1) {
        const path = new Path2D();
        path.arc(x, y, halfWidth, 0, 2 * Math.PI);
        ctx.fill(path);
      } else {
        const path = new Path2D();
        path.moveTo(x, y);
        points.slice(1).forEach(({ x,y }) => path.lineTo(x, y));
        ctx.stroke(path);
      }
    });
  }

  protected initializeListeners(): void {
    this.onMouseDown((event) => {
      this.isDrawing = true;
      this.points.push(Point.fromEvent(event));
      this.renderPreview();
    });

    this.onMouseUp(() => this.resetState());
    this.onMouseLeave(() => this.resetState());

    this.onMove((event) => {
      if (!this.isDrawing) return;
      this.points.push(Point.fromEvent(event));
      this.renderPreview();
    });
  }

  protected override renderPreview(): void {
    super.renderPreview();

    if (this.points.length === 1) {
      const [{ x, y }] = this.points;
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.halfWidth, 0, 2 * Math.PI);
      this.ctx.fill();
    } else {
      if (this.points.length === 2) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.points[0].x, this.points[0].y);
      }

      const { x, y } = this.points[this.lastPaintedIndex + 1];
      this.ctx.lineTo(x, y);
      this.lastPaintedIndex++;
      this.ctx.stroke();
    }
  }

  protected async getCustomCursor(): Promise<string> {
    const offsetCanvas = new OffscreenCanvas(this.lineWidth, this.lineWidth);
    const ctx = offsetCanvas.getContext('2d')!;
    ctx.fillStyle = this.colour;
    let x: number, y: number, radius: number;
    x = y = radius = this.lineWidth / 2;
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    const blob = await offsetCanvas.convertToBlob();
    this.cursorObjectUrl = URL.createObjectURL(blob);
    return `url(${this.cursorObjectUrl}) ${this.halfWidth} ${this.halfWidth}, auto`;
  }

  private resetState(): void {
    this.isDrawing = false;
    this.lastPaintedIndex = 0;
    this.tryCreateLayer();
    this.points = [];
  }
}
