import { SimpleBrush } from '../../abstract/SimpleBrush.ts';
import type { ToolState } from '../../models/ToolState.ts';
import { type LayerFacade } from '../../../LayerFacade.ts';

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

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super({ ...toolState, shadowBlur: 1 }, layerFacade);

    const radius = this.halfSize;
    const angle = -45;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    this.vec2 = [x, y];
    this.invertedVec2 = [-x, -y];
  }

  public tryCreateLayer(): void {
    if (this.points.length == 0) return;

    const points = this.points;
    const [posX, posY] = this.vec2;
    const [negX, negY] = this.invertedVec2;

    this.createLayer((ctx: CanvasRenderingContext2D) => {
      if (points.length === 1) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        const [{ x, y }] = points;
        ctx.moveTo(x + negX, y + negY);
        ctx.lineTo(x + posX, y + posY);
        ctx.stroke();
      } else {

        ctx.beginPath();

        const [{ x, y }] = points;
        ctx.moveTo(x + posX, y + posY);

        for (let i = 1; i < points.length; i++) {
          const { x: px, y: py } = points[i - 1];
          const { x: cx, y: cy } = points[i];

          ctx.lineTo(px + posX, py + posY);
          ctx.lineTo(cx + posX, cy + posY);
        }

        for (let i = points.length - 1; i > 0; i--) {
          const { x: cx, y: cy } = points[i];
          const { x: nx, y: ny } = points[i - 1];

          ctx.lineTo(cx + negX, cy + negY);
          ctx.lineTo(nx + negX, ny + negY);
        }

        ctx.closePath();
        ctx.fill()
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

    this.ctx.beginPath();

    const [{ x, y }] = this.points;
    this.ctx.moveTo(x + this.vec2[0], y + this.vec2[1]);

    for (let i = 1; i < this.points.length; i++) {
      const { x: px, y: py } = this.points[i - 1];
      const { x: cx, y: cy } = this.points[i];

      this.ctx.lineTo(px + this.vec2[0], py + this.vec2[1]);
      this.ctx.lineTo(cx + this.vec2[0], cy + this.vec2[1]);
    }

    for (let i = this.points.length - 1; i > 0; i--) {
      const { x: cx, y: cy } = this.points[i];
      const { x: nx, y: ny } = this.points[i - 1];

      this.ctx.lineTo(cx + this.invertedVec2[0], cy + this.invertedVec2[1]);
      this.ctx.lineTo(nx + this.invertedVec2[0], ny + this.invertedVec2[1]);
    }

    this.ctx.closePath();
    this.ctx.fill()
  }
}
