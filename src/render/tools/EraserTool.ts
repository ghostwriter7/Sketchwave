import { ToolHandler } from './ToolHandler.ts';
import type { ToolState } from './ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { Point } from '../primitives/Point.ts';

export class EraserTool extends ToolHandler {
  private isErasing = false;
  private points = [] as Point[];

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }

  public tryCreateLayer(): void {
    if (this.points.length === 0) return;

    const points = this.points;

    this.layerFacade.pushLayer({
      tool: this.name,
      draw: (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = 'white';
        points.forEach(({ x, y }) => ctx.fillRect(x, y, 10, 10));
      }
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
    const objectUrl = URL.createObjectURL(blob);
    return `url('${objectUrl}'), auto`;
  }

  protected renderPreview(): void {
    super.renderPreview();
    this.ctx.fillStyle = 'white';
    this.points.forEach(({ x, y }) => {
      this.ctx.fillRect(x, y, 10, 10)
    });
  }
}
