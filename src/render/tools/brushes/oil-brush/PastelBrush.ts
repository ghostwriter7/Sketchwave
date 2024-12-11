import type { ToolState } from '../../models/ToolState.ts';
import type { LayerFacade } from '../../../LayerFacade.ts';
import { SimpleBrush } from '../../abstract/SimpleBrush.ts';
import { calculateDistance } from '../../../../math/distance.ts';
import type { Point } from '../../../../types/Point.ts';
import { getMidPoints } from '../../../../math/get-mid-points.ts';
import { stringifyRgb } from '../../../../color/stringify-rgb.ts';
import { applyToolState } from '../../helpers/apply-tool-state.ts';
import { FULL_CIRCLE } from '../../../../constants.ts';

export class PastelBrush extends SimpleBrush {
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
    } else {
      const prevPoint = this.points.at(-1)!;
      const distance = calculateDistance(prevPoint, point);

      if (distance > 1) {
        this.points.push(...getMidPoints(prevPoint, point));
      } else {
        this.points.push(point);
      }

      this.renderPreview();
    }
  };

  private readonly firstRange: [number, number];
  private readonly secondRange: [number, number];
  private readonly thirdRange: [number, number];
  private readonly strokeLength = 1250;
  private readonly radius: number;
  private offscreenCtx!: OffscreenCanvasRenderingContext2D;

  private get currentStokeLength(): number {
    return this.points.length;
  }

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super({ ...toolState, shadowBlur: 3 }, layerFacade);
    this.initializeOffscreenCanvas();
    this.firstRange = [.025 * this.strokeLength, .975 * this.strokeLength];
    this.secondRange = [.05 * this.strokeLength, .95 * this.strokeLength];
    this.thirdRange = [.1 * this.strokeLength, .9 * this.strokeLength];
    this.radius = this.halfSize / 7;
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

    const rgb = this.toolState.rgb;
    const ctx = this.offscreenCtx;
    const radius = this.radius;

    this.points.slice(this.lastPointIndex).forEach(({ x, y }: Point) => {
      const numberOfStreams = this.calculateNumberOfStreams();

      ctx.beginPath();
      const primaryAlpha = this.calculateBaseAlpha();

      if (Math.random() > 0.25) {
        ctx.fillStyle = stringifyRgb([...rgb, primaryAlpha]);
        ctx.arc(x, y, radius * (Math.random() + 0.5), 0, FULL_CIRCLE);
        ctx.fill();
      }

      const remainingStreams = numberOfStreams - 1;

      if (remainingStreams > 0) {
        const halfRadius = radius / 2;
        const halfOfRemainingStreams = remainingStreams / 2;

        for (let i = -halfOfRemainingStreams; i < halfOfRemainingStreams; i++) {
          if (i == 0) continue;
          const jitterX = (Math.random() - 0.5) * radius * 0.5;
          const jitterY = (Math.random() - 0.5) * radius * 0.5;

          const alpha = Math.random() > 0.85 ? primaryAlpha : primaryAlpha * (Math.random() * (i % 2 == 0 ? 0.5 : 0.05));

          ctx.beginPath();
          const offsetY = i * radius + Math.sign(i) * halfRadius;
          ctx.fillStyle = stringifyRgb([...rgb, alpha]);
          const radiusVariety = radius * (Math.random() + 0.55);
          ctx.arc(x + jitterX, y + jitterY + offsetY, radiusVariety, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

    });

    this.ctx.drawImage(ctx.canvas, 0, 0);

    this.lastPointIndex = this.points.length - 1;
  }

  protected resetState(): void {
    super.resetState();
    this.lastPointIndex = 0;
    this.points = [];
    this.initializeOffscreenCanvas();
  }

  private calculateNumberOfStreams(): number {
    if (this.isInRange(this.firstRange))
      return 3;

    if (this.isInRange(this.secondRange))
      return 7;

    if (this.isInRange(this.thirdRange))
      return 11;

    const randomInRange = Math.floor((Math.random() * 3) + 13);
    return randomInRange % 2 == 0 ? randomInRange + 1 : randomInRange;
  }

  private calculateBaseAlpha(): number {
    if (this.isInRange(this.firstRange))
      return 0.05;

    if (this.isInRange(this.secondRange))
      return 0.15;

    if (this.isInRange(this.thirdRange))
      return 0.3;

    return 0.5 * (Math.random() + 0.25);
  }

  private isInRange(range: [number, number]): boolean {
    return this.currentStokeLength <= range[0] || this.currentStokeLength >= range[1];
  }

  private initializeOffscreenCanvas(): void {
    this.offscreenCtx = new OffscreenCanvas(this.width, this.height).getContext('2d')!;
    applyToolState(this.offscreenCtx, this.toolState);
  }
}
