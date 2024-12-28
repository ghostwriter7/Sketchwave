import type { Layer } from '../types/core.type.ts';
import { Logger } from '../utils/Logger.ts';
import { type GlobalContextState, useGlobalContext } from '../global-provider.tsx';
import { type Accessor, createSignal, type Setter } from 'solid-js';
import { ThemeHelper } from '../utils/ThemeHelper.ts';

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
  private readonly setDimensions: (width: number, height: number) => void;
  private readonly state: GlobalContextState;

  public get ctx(): CanvasRenderingContext2D {
    return this.state.ctx!;
  }

  constructor() {
    const { state, setDimensions } = useGlobalContext();
    this.setDimensions = setDimensions;
    this.state = state;

    const [canUndo, setCanUndo] = createSignal(false);
    const [canRedo, setCanRedo] = createSignal(false);
    this.canUndo = canUndo;
    this.canRedo = canRedo;

    this.setCanRedo = setCanRedo;
    this.setCanUndo = setCanUndo;

    const width = this.state.width;
    const height = this.state.height;

    this.stack.push({
      originX: 0,
      originY: 0,
      canvasHeight: state.height,
      canvasWidth: state.width,
      order: this.nextLayerIndex,
      tool: LayerFacade.name,
      draw: (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = ThemeHelper.getColor('gray');
        ctx.fillRect(0, 0, width, height);
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
    this.stack.push({
      ...layer,
      order: this.nextLayerIndex,
      canvasWidth: Math.floor(layer.canvasWidth),
      canvasHeight: Math.floor(layer.canvasHeight),
      originX: layer.originX || 0,
      originY: layer.originY || 0,
    });
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

    const { canvasWidth, canvasHeight } = this.stack.at(-1)!;
    if (canvasWidth != this.state.width || canvasHeight != this.state.height) {
      this.setDimensions(canvasWidth, canvasHeight);
    }

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
    const ctx = offscreenCanvas.getContext('2d', { willReadFrequently: true })!;

    this.stack.forEach((layer) => {
      const { canvasWidth, canvasHeight, originX, originY } = layer;

      if (offscreenCanvas.width !== canvasWidth || offscreenCanvas.height !== canvasHeight) {
        const imageData = ctx.getImageData(originX!, originY!, canvasWidth, canvasHeight);
        offscreenCanvas.width = canvasWidth;
        offscreenCanvas.height = canvasHeight;
        imageData && ctx.putImageData(imageData, 0, 0);
      }

      ctx.save();
      layer.draw(ctx);
      ctx.restore();
    });

    return ctx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  }
}
