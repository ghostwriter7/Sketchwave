import type { ToolState } from '../../models/ToolState.ts';
import type { LayerFacade } from '../../../LayerFacade.ts';
import { SimpleBrush } from '../../abstract/SimpleBrush.ts';
import { calculateDistance } from '../../../../math/distance.ts';
import type { Point } from '../../../primitives/Point.ts';
import { getMidPoints } from '../../../../math/get-mid-points.ts';
import { stringifyRgb } from '../../../../color/stringify-rgb.ts';
import { applyToolState } from '../../helpers/apply-tool-state.ts';

export class OilBrush extends SimpleBrush {
  protected cursorSize = this.size + 2;
  protected customCursorCreateFn = (ctx: OffscreenCanvasRenderingContext2D) => {
    ctx.strokeStyle = this.colour;
    const center = this.cursorSize / 2;
    ctx.arc(center, center, this.size / 2, 0, 2 * Math.PI);
    ctx.stroke();
  }

  protected override onNewPoint = (point: Point) => {
    if (this.points.length == 0) {
      this.points.push(point);
      return;
    }

    const prevPoint = this.points.at(-1)!;
    const distance = calculateDistance(prevPoint, point);

    if (distance > 1) {
      this.points.push(...getMidPoints(prevPoint, point));
    } else {
      this.points.push(point);
    }

    if (this.points.length >= 2) this.renderPreview();
  };

  private readonly strokeLength = 1250;
  private offscreenCtx: OffscreenCanvasRenderingContext2D;

  private get currentStokeLength(): number {
    return this.points.length;
  }

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super({ ...toolState, shadowBlur: 3 }, layerFacade);
    this.offscreenCtx = new OffscreenCanvas(this.width, this.height).getContext('2d')!;
    applyToolState(this.offscreenCtx, toolState);
  }

  public tryCreateLayer(): void {
    if (this.points.length < 2) return;

    const offscreenCanvas = this.offscreenCtx.canvas;

    this.createLayer((ctx: CanvasRenderingContext2D) => {
      ctx.drawImage(offscreenCanvas, 0, 0);
    });

  }

  protected renderPreview() {
    if (this.points.length < 1 || this.currentStokeLength >= this.strokeLength) return;
    super.renderPreview();

    this.points.slice(this.lastPointIndex).forEach(({ x, y }: Point) => {
      const numberOfStreams = this.calculateNumberOfStreams();

      const radius = this.halfSize / 7;

      this.offscreenCtx.beginPath();
      const primaryAlpha = this.calculateBaseAlpha();

      this.offscreenCtx.fillStyle = stringifyRgb(this.toolState.color, primaryAlpha);
      this.offscreenCtx.arc(x, y, radius, 0, 2 * Math.PI);
      this.offscreenCtx.fill();

      const remainingStreams = numberOfStreams - 1;

      if (remainingStreams > 0) {
        const halfRadius = radius / 2;
        const halfOfRemainingStreams = remainingStreams / 2;

        for (let j = -halfOfRemainingStreams; j < halfOfRemainingStreams; j++) {
          if (j == 0) continue;
          const jitterX = (Math.random() - 0.5) * radius * 0.5;
          const jitterY = (Math.random() - 0.5) * radius * 0.5;

          const alpha = primaryAlpha * Math.random() * (j % 2 == 0 ? 0.5 : 0.25);

          this.offscreenCtx.beginPath();
          const offsetY = j * radius + Math.sign(j) * halfRadius;
          this.offscreenCtx.fillStyle = stringifyRgb(this.toolState.color, alpha);
          const radiusVariety = radius * (Math.random() + 1);
          this.offscreenCtx.arc(x + jitterX, y + jitterY + offsetY, radiusVariety, 0, 2 * Math.PI);
          this.offscreenCtx.fill();
        }
      }

    });

    this.ctx.drawImage(this.offscreenCtx.canvas, 0, 0);

    this.lastPointIndex = this.points.length - 1;
  }


  protected resetState(): void {
    super.resetState();
    this.lastPointIndex = 0;
    this.points = [];
    this.offscreenCtx = new OffscreenCanvas(this.width, this.height).getContext('2d')!;
  }

  private calculateNumberOfStreams(): number {
    if (this.currentStokeLength <= 0.025 * this.strokeLength || this.currentStokeLength >= 0.975 * this.strokeLength)
      return 1;

    if (this.currentStokeLength <= 0.05 * this.strokeLength || this.currentStokeLength >= 0.95 * this.strokeLength)
      return 3;

    if (this.currentStokeLength <= 0.1 * this.strokeLength || this.currentStokeLength >= 0.9 * this.strokeLength)
      return 5;

    return 7;
  }

  private calculateBaseAlpha(): number {
    if (this.currentStokeLength <= 0.025 * this.strokeLength || this.currentStokeLength >= 0.975 * this.strokeLength)
      return 0.1;

    if (this.currentStokeLength <= 0.05 * this.strokeLength || this.currentStokeLength >= 0.95 * this.strokeLength)
      return 0.2;

    if (this.currentStokeLength <= 0.1 * this.strokeLength || this.currentStokeLength >= 0.9 * this.strokeLength)
      return 0.3;

    return 0.5;
  }

}
