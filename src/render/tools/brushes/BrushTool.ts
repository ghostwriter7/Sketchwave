import type { ToolState } from '../models/ToolState.ts';
import type { LayerFacade } from '../../LayerFacade.ts';
import { SimpleTool } from '../abstract/SimpleTool.ts';

export class BrushTool extends SimpleTool {
  protected override cursorSize = this.lineWidth;
  protected override customCursorCreateFn = (ctx: OffscreenCanvasRenderingContext2D) => {
    ctx.fillStyle = this.colour;
    let x: number, y: number, radius: number;
    x = y = radius = this.lineWidth / 2;
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super({ ...toolState, lineCap: 'round', lineJoin: 'round' }, layerFacade);
  }

  public tryCreateLayer(): void {
    if (this.points.length === 0) return;

    const points = this.points;
    const halfWidth = this.halfSize;

    this.createLayer((ctx: CanvasRenderingContext2D) => {
      const [{ x, y }] = points;
      const path = new Path2D();

      if (points.length === 1) {
        path.arc(x, y, halfWidth, 0, 2 * Math.PI);
        ctx.fill(path);
      } else {
        path.moveTo(x, y);
        points.slice(1).forEach(({ x, y }) => path.lineTo(x, y));
        ctx.stroke(path);
      }
    });
  }

  protected override renderPreview(): void {
    if (this.points.length === 1) {
      const [{ x, y }] = this.points;
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.halfSize, 0, 2 * Math.PI);
      this.ctx.fill();
    } else {
      if (this.points.length === 2) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.points[0].x, this.points[0].y);
      }

      const { x, y } = this.points[this.lastPointIndex + 1];
      this.ctx.lineTo(x, y);
      this.lastPointIndex++;
      this.ctx.stroke();
    }
  }
}
