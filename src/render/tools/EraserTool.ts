import { ToolHandler } from './ToolHandler.ts';
import type { ToolState } from './ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { Point } from '../primitives/Point.ts';

export class EraserTool extends ToolHandler {
  private isErasing = false;
  private points = [] as Point[];
  private objectUrl!: string;

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }

  public override onDestroy() {
    super.onDestroy();
    URL.revokeObjectURL(this.objectUrl);
  }

  public tryCreateLayer(): void {
    if (this.points.length === 0) return;

    const points = this.points;
    const draw = (ctx: CanvasRenderingContext2D): void => this.drawLines(ctx, points);
    this.layerFacade.pushLayer({
      tool: this.name,
      draw
    });
  }

  protected initializeListeners(): void {
    this.onMouseDown(() => this.isErasing = true);

    this.onMouseUp(() => {
      this.isErasing = false;
      this.tryCreateLayer();
      this.points = [];
    });

    this.onMove((event) => {
      if (!this.isErasing) return;
      const { offsetX, offsetY } = event;
      this.points.push(new Point(offsetX, offsetY));
      this.renderPreview();
    })
  }

  protected async getCustomCursor(): Promise<string> {
    const canvas = new OffscreenCanvas(12, 12);
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    const blob = await ctx.canvas.convertToBlob();
    this.objectUrl = URL.createObjectURL(blob);
    return `url('${this.objectUrl}'), auto`;
  }

  protected renderPreview(): void {
    super.renderPreview();
    this.drawLines(this.ctx, this.points);
  }

  private drawLines(ctx: CanvasRenderingContext2D, points: Point[]): void {
    if (this.points.length <= 1) return;

    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.lineJoin = 'bevel';
    ctx.moveTo(points[0].x + 5, points[0].y + 5);
    points.slice(1).forEach(({ x, y }) => {
      ctx.lineTo(x + 5, y + 5);
    });
    ctx.stroke();
  }
}
