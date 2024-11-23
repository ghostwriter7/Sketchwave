import { ToolHandler } from './ToolHandler.ts';
import type { ToolState } from './ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { Point } from '../primitives/Point.ts';

export class EraserTool extends ToolHandler {
  private isErasing = false;
  private points = [] as Point[];

  private currentPath: Path2D | null = null;
  private lastPointIndex = 0;

  private readonly WIDTH = 10;
  private readonly HALF_WIDTH = 5;
  private readonly COLOR = 'white';

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
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

  public override async onInit(): Promise<void> {
    await super.onInit();

    this.ctx.strokeStyle = this.COLOR;
    this.ctx.fillStyle = this.COLOR;
    this.ctx.lineWidth = this.WIDTH;
    this.ctx.lineJoin = 'bevel';
  }

  protected initializeListeners(): void {

    this.onMouseDown(({ offsetX, offsetY }) => {
      this.points.push(new Point(offsetX, offsetY));
      this.currentPath = new Path2D();
      this.currentPath.moveTo(offsetX + this.HALF_WIDTH, offsetY + this.HALF_WIDTH);
      this.isErasing = true
      this.renderPreview();
    });

    this.onMouseUp(() => this.resetAndSave());
    this.onMouseLeave(() => this.resetAndSave());

    this.onMove(({ offsetX, offsetY }) => {
      if (!this.isErasing) return;
      this.points.push(new Point(offsetX, offsetY));
      this.renderPreview();
    });
  }

  private resetAndSave(): void {
    this.isErasing = false;
    if (this.points.length === 0) return;
    this.tryCreateLayer();
    this.currentPath = null;
    this.points = [];
    this.lastPointIndex = 0;
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
    this.cursorObjectUrl = URL.createObjectURL(blob);
    return `url('${this.cursorObjectUrl}'), auto`;
  }

  protected renderPreview(): void {
    super.renderPreview();

    if (this.points.length === 1) {
      this.ctx.fillRect(this.points[0].x, this.points[0].y, this.WIDTH, this.WIDTH);
    } else {
      this.currentPath!.lineTo(this.points[this.lastPointIndex + 1].x + this.HALF_WIDTH, this.points[this.lastPointIndex + 1].y + this.HALF_WIDTH);
      this.lastPointIndex++;
      this.ctx.stroke(this.currentPath!);
    }
  }

  private drawLines(ctx: CanvasRenderingContext2D, points: Point[]): void {
    if (points.length < 1) return;

    if (points.length === 1) {
      ctx.fillStyle = this.COLOR;
      ctx.fillRect(points[0].x, points[0].y, this.WIDTH, this.WIDTH);
    } else {
      ctx.strokeStyle = this.COLOR;
      ctx.beginPath();
      ctx.lineWidth = this.WIDTH;
      ctx.lineJoin = 'bevel';
      ctx.moveTo(points[0].x + this.HALF_WIDTH, points[0].y + this.HALF_WIDTH);
      points.slice(1).forEach(({ x, y }) => {
        ctx.lineTo(x + this.HALF_WIDTH, y + this.HALF_WIDTH);
      });
      ctx.stroke();
    }
  }
}
