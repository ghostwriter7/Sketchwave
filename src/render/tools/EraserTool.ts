import { ToolState } from './models/ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { Point } from '../../types/Point.ts';
import { SimpleBrush } from './abstract/SimpleBrush.ts';
import { getMidPoints } from '../../math/get-mid-points.ts';

export class EraserTool extends SimpleBrush {
  protected override cursorSize = Math.max(this.toolState.size + 2, 10);
  protected override customCursorCreateFn = (ctx: OffscreenCanvasRenderingContext2D) => {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.fillRect(0, 0, this.cursorSize, this.cursorSize);
    ctx.strokeRect(0, 0, this.cursorSize, this.cursorSize);
  }

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super({
      ...toolState,
      fillStyle: 'white',
      strokeStyle: 'white',
      size: Math.max(toolState.size + 2, 10),
      lineJoin: 'bevel',
      lineCap: 'square'
    }, layerFacade);
  }

  public tryCreateLayer(): void {
    if (this.points.length === 0) return;

    const points = this.points;
    const size = this.size;

    this.createLayer((ctx: CanvasRenderingContext2D): void => EraserTool.drawLines(ctx, points, size));
  }

  protected renderPreview(): void {
    super.renderPreview();
    EraserTool.drawLines(this.ctx, this.points, this.size);
  }

  private static drawLines(ctx: CanvasRenderingContext2D, points: Point[], size: number): void {
    if (points.length < 1) return;

    const halfSize = size / 2;
    points.flatMap((point, index, array) =>
      index == 0 ? [point] : getMidPoints(array[index - 1], point))
      .forEach(({ x, y }) => ctx.fillRect(x - halfSize, y - halfSize, size, size));
  }
}
