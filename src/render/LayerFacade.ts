import type { Layer } from '../types/core.type.ts';
import { Logger } from '../utils/Logger.ts';

export class LayerFacade {
  private stack: Layer[] = [];
  private readonly logger = new Logger(LayerFacade)
  private snapshot: ImageData;

  constructor(private readonly ctx: CanvasRenderingContext2D) {
    this.stack.push({
      tool: LayerFacade.name,
      draw: (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      }
    });
    this.snapshot = this.createSnapshot();
  }

  public clearLayers(): void {
    this.stack.splice(1);
  }

  public hasAnyLayers(): boolean {
    return this.stack.length > 1;
  }

  public pushLayer(layer: Layer): void {
    this.stack.push(layer);
    this.logger.log(`A new layer created by ${layer.tool}. Current count: ${this.stack.length}`);
    this.refreshSnapshot();
  }

  public refreshSnapshot(): void {
    this.snapshot = this.createSnapshot();
  }

  public renderLayers(): void {
    this.logger.log(`Rendering layers...`);
    this.ctx.putImageData(this.snapshot, 0, 0);
  }

  private createSnapshot(): ImageData {
    const offscreenCanvas = new OffscreenCanvas(this.ctx.canvas.width, this.ctx.canvas.height);
    const ctx = offscreenCanvas.getContext('2d')!;
    this.stack.forEach((layer) => layer.draw(ctx));
    return ctx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  }
}
