import type { Layer } from '../types/core.type.ts';
import { Logger } from '../utils/Logger.ts';
import type { GlobalContextState } from '../global-provider.tsx';
import { type Accessor, createSignal, type Setter } from 'solid-js';

export class LayerFacade {
  public readonly canUndo: Accessor<boolean>;
  public readonly canRedo: Accessor<boolean>;

  private stack: Layer[] = [];
  private history: Layer[] = [];
  private readonly logger = new Logger(LayerFacade)
  private snapshot: ImageData;

  private nextLayerIndex = 0;
  private readonly setCanUndo: Setter<boolean>;
  private readonly setCanRedo: Setter<boolean>;

  public get ctx(): CanvasRenderingContext2D {
    return this.state.ctx!;
  }

  constructor(private readonly state: GlobalContextState) {
    const [canUndo, setCanUndo] = createSignal(false);
    const [canRedo, setCanRedo] = createSignal(false);

    this.canUndo = canUndo;
    this.canRedo = canRedo;

    this.setCanRedo = setCanRedo;
    this.setCanUndo = setCanUndo;

    this.stack.push({
      order: this.nextLayerIndex,
      tool: LayerFacade.name,
      draw: (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      }
    });
    this.nextLayerIndex++;
    this.snapshot = this.createSnapshot();
  }

  public clearLayers(): void {
    this.stack.splice(1);
  }

  public hasAnyLayers(): boolean {
    return this.stack.length > 1;
  }

  public pushLayer(layer: Layer): void {
    this.stack.push({ ...layer, order: this.nextLayerIndex });
    this.nextLayerIndex++;
    this.logger.log(`A new layer created by ${layer.tool}. Current count: ${this.stack.length}`);
    this.refreshSnapshot();
    this.setCanUndo(true);
  }

  public refreshSnapshot(): void {
    this.snapshot = this.createSnapshot();
  }

  public renderLayers(): void {
    this.logger.log(`Rendering layers...`);
    this.ctx.putImageData(this.snapshot, 0, 0);
  }

  public redoLayer(): void {
    if (this.history.length < 1) return;

    const layer = this.history.pop()!
    this.logger.log(`Redoing layer (order: ${layer.order})`);
    this.stack.push(layer);
    this.stack.sort((a, b) => a.order! - b.order!);
    this.refreshSnapshot();
    this.renderLayers();
    this.setCanRedo(this.history.length > 0);
    this.setCanUndo(true);
  }

  public undoLayer(): void {
    if (this.stack.length <= 1) return;

    const lastLayer = this.stack.pop()!;
    this.logger.log(`Undoing last layer (order: ${lastLayer.order})`);
    this.history.push(lastLayer);
    this.refreshSnapshot();
    this.renderLayers();
    this.setCanUndo(this.stack.length > 1);
    this.setCanRedo(true);
  }

  private createSnapshot(): ImageData {
    const offscreenCanvas = new OffscreenCanvas(this.ctx.canvas.width, this.ctx.canvas.height);
    const ctx = offscreenCanvas.getContext('2d')!;
    this.stack.forEach((layer) => {
      ctx.save();
      layer.draw(ctx);
      ctx.restore();
    });
    return ctx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  }
}
