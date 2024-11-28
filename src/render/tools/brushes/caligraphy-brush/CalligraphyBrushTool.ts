import { SimpleBrush } from '../../abstract/SimpleBrush.ts';
import type { ToolState } from '../../models/ToolState.ts';
import { type LayerFacade } from '../../../LayerFacade.ts';
import { applyToolState } from '../../helpers/apply-tool-state.ts';

export class CalligraphyBrushTool extends SimpleBrush {
  protected override cursorSize = this.size + 2;
  protected override customCursorCreateFn = (ctx: OffscreenCanvasRenderingContext2D) => {
    ctx.fillStyle = this.colour;
    ctx.translate(this.halfSize, this.halfSize)
    ctx.rotate((Math.PI / 180) * 315);
    ctx.fillRect(0, 0, this.size, 1);
  };

  private readonly vec2: [number, number];
  private readonly invertedVec2: [number, number];
  private offscreenCtx: OffscreenCanvasRenderingContext2D;

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super({ ...toolState, shadowBlur: 2, shadowColor: toolState.fillStyle.replace(')', ', 0.9)') }, layerFacade);

    const radius = this.halfSize;
    const angle = -45;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    this.vec2 = [x, y];
    this.invertedVec2 = [-x, -y];

    this.offscreenCtx = new OffscreenCanvas(this.width, this.height).getContext('2d')!;
    applyToolState(this.offscreenCtx, this.toolState);
  }

  public tryCreateLayer(): void {
    if (this.points.length == 0) return;

    const points = this.points;
    const [posX, posY] = this.vec2;
    const [negX, negY] = this.invertedVec2;
    const offscreenCanvas = this.offscreenCtx.canvas;

    this.createLayer((ctx: CanvasRenderingContext2D) => {
      if (points.length === 1) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        const [{ x, y }] = points;
        ctx.moveTo(x + negX, y + negY);
        ctx.lineTo(x + posX, y + posY);
        ctx.stroke();
      } else {
        ctx.drawImage(offscreenCanvas, 0, 0);
      }
    });
  }

  protected renderPreview(): void {
    if (this.points.length === 1) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      const [{ x, y }] = this.points;
      this.ctx.moveTo(x + this.invertedVec2[0], y + this.invertedVec2[1]);
      this.ctx.lineTo(x + this.vec2[0], y + this.vec2[1]);
      this.ctx.stroke();
      return;
    }

    const [{ x, y }] = this.points;
    this.offscreenCtx.beginPath();
    this.offscreenCtx.moveTo(x + this.vec2[0], y + this.vec2[1]);

    for (let i = 1; i < this.points.length; i++) {
      const { x: px, y: py } = this.points[i - 1];
      const { x: cx, y: cy } = this.points[i];

      this.offscreenCtx.lineTo(px + this.vec2[0], py + this.vec2[1]);
      this.offscreenCtx.lineTo(cx + this.vec2[0], cy + this.vec2[1]);
    }

    for (let i = this.points.length - 1; i > 0; i--) {
      const { x: cx, y: cy } = this.points[i];
      const { x: nx, y: ny } = this.points[i - 1];

      this.offscreenCtx.lineTo(cx + this.invertedVec2[0], cy + this.invertedVec2[1]);
      this.offscreenCtx.lineTo(nx + this.invertedVec2[0], ny + this.invertedVec2[1]);
    }

    this.offscreenCtx.closePath();
    this.offscreenCtx.fill();

    super.renderPreview();
    this.ctx.drawImage(this.offscreenCtx.canvas, 0, 0);
  }

  protected override resetState(): void {
    super.resetState();
    this.offscreenCtx = new OffscreenCanvas(this.width, this.height).getContext('2d')!;
    applyToolState(this.offscreenCtx, this.toolState);
  }
}
