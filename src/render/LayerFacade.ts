import type { Layer } from '../types/core.type.ts';
import { Logger } from '../utils/Logger.ts';

export class LayerFacade {
  private readonly stack: Layer[] = [];
  private readonly logger = new Logger(LayerFacade)

  constructor(private readonly ctx: CanvasRenderingContext2D) {
  }

  public pushLayer(layer: Layer): void {
    this.stack.push(layer);
    this.logger.log(`A new layer created by ${layer.tool}. Current count: ${this.stack.length}`);
  }

  public renderLayers(): void {
    this.logger.log(`Rendering layers...`);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.stack.forEach((layer) => layer.draw());
  }
}
