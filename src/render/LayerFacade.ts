import type { Layer } from '../types/core.type.ts';
import { Logger } from '../utils/Logger.ts';

export class LayerFacade {
  private readonly stack: Layer[] = [];
  private readonly logger = new Logger(LayerFacade)

  public pushLayer(layer: Layer): void {
    this.stack.push(layer);
    this.logger.log(`A new layer created by ${layer.tool}. Current count: ${this.stack.length}`);
  }

  public renderLayers(): void {
    this.logger.log(`Rendering layers...`);
    this.stack.forEach((layer) => layer.draw());
  }
}
