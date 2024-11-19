import type { Layer } from '../types/core.type.ts';
import { Logger } from '../utils/Logger.ts';

export class LayerFacade {
  private stack: Layer[] = [];
  private readonly logger = new Logger(LayerFacade)

  constructor(private readonly ctx: CanvasRenderingContext2D) {
  }

  public clearLayers(): void {
    this.stack = [];
  }

  public hasAnyLayers(): boolean {
    return this.stack.length > 0;
  }

  public pushLayer(layer: Layer): void {
    this.stack.push(layer);
    this.logger.log(`A new layer created by ${layer.tool}. Current count: ${this.stack.length}`);
  }

  public renderLayers(): void {
    this.logger.log(`Rendering layers...`);
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.stack.forEach((layer) => layer.draw(this.ctx));
  }
}
