import { ToolHandler } from '../ToolHandler.ts';
import type { ToolState } from '../ToolState.ts';
import type { LayerFacade } from '../../LayerFacade.ts';
import { Point } from '../../primitives/Point.ts';

export class BrushTool extends ToolHandler {
  private points: Point[] = [];
  private isDrawing = false;
  private lastPaintedIndex = 0;

  private readonly halfWidth: number;

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
    this.halfWidth = this.lineWidth / 2;
  }

  public tryCreateLayer(): void {
    if (this.points.length < 1) return;

    const points = this.points;
    const lineWidth = this.lineWidth;
    const colour = this.colour;
    const halfWidth = this.halfWidth;

    this.layerFacade.pushLayer({
      tool: this.name,
      draw: (ctx: CanvasRenderingContext2D) => {
        BrushTool.setContextProperties(ctx, lineWidth, colour);

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
      }
    });
  }

  protected initializeListeners(): void {
    BrushTool.setContextProperties(this.ctx, this.lineWidth, this.colour);

    this.onMouseDown((event) => {
      this.isDrawing = true;
      this.points.push(this.createPointFromEvent(event));
      this.renderPreview();
    });

    this.onMouseUp(() => this.resetState());
    this.onMouseLeave(() => this.resetState());

    this.onMove((event) => {
      if (!this.isDrawing) return;
      this.points.push(this.createPointFromEvent(event));
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

  private createPointFromEvent({ offsetX, offsetY }: MouseEvent): Point {
    return new Point(offsetX , offsetY );
  }

  private resetState(): void {
    this.isDrawing = false;
    this.lastPaintedIndex = 0;
    this.tryCreateLayer();
    this.points = [];
  }

  private static setContextProperties(ctx: CanvasRenderingContext2D, lineWidth: number, colour: string): void {
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = ctx.fillStyle = colour;
  }
}
