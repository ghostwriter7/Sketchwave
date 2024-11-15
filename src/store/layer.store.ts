import type { Layer } from '../types/core.type.ts';

export class LayerStore {
  #layers: Layer[] = [];

  public get layers(): Layer[] {
    return [...this.#layers]
  }

  public addLayer(layer: Layer): void {
    this.#layers.push(layer);
  }

  public removeLayer(layerId: string): void {
    this.#layers = this.#layers.filter(({ id }) => id !== layerId);
  }
}
