import { ToolState } from './models/ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { Point } from '../primitives/Point.ts';
import { applyToolState } from './helpers/apply-tool-state.ts';
import { SimpleTool } from './abstract/SimpleTool.ts';

export class EraserTool extends SimpleTool {
  private static readonly WIDTH = 10;

  constructor(_: ToolState, layerFacade: LayerFacade) {
    super({
      fillStyle: 'white',
      strokeStyle: 'white',
      size: 10,
      lineJoin: 'bevel',
      lineCap: 'butt'
    }, layerFacade);
  }

  public tryCreateLayer(): void {
    if (this.points.length === 0) return;

    const points = this.points;
    const toolState = this.toolState;

    const draw = (ctx: CanvasRenderingContext2D): void => {
      applyToolState(ctx, toolState);
      EraserTool.drawLines(ctx, points);
    }
    this.createLayer(draw);
  }

  protected async getCustomCursor(): Promise<string> {
    const canvas = new OffscreenCanvas(12, 12);
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    const blob = await ctx.canvas.convertToBlob();
    this.cursorObjectUrl = URL.createObjectURL(blob);
    return `url('${this.cursorObjectUrl}') ${this.halfSize} ${this.halfSize}, auto`;
  }

  protected renderPreview(): void {
    super.renderPreview();

    const [{ x, y }] = this.points;
    if (this.points.length === 1) {
      this.ctx.fillRect(x - 5, y - 5, EraserTool.WIDTH, EraserTool.WIDTH);
    } else {
      if (this.points.length === 2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
      }

      this.ctx.lineTo(this.points[this.lastPointIndex + 1].x, this.points[this.lastPointIndex + 1].y);
      this.lastPointIndex++;
      this.ctx.stroke();
    }
  }

  private static drawLines(ctx: CanvasRenderingContext2D, points: Point[]): void {
    if (points.length < 1) return;

    const [{ x, y }] = points;
    if (points.length === 1) {
      ctx.fillRect(x - 5, y - 5, EraserTool.WIDTH, EraserTool.WIDTH);
    } else {
      ctx.beginPath();
      ctx.moveTo(x, y);
      points.slice(1).forEach(({ x, y }) => {
        ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }
}
