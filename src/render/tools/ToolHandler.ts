import type { Constructor, Layer } from '../../types/core.type.ts';
import type { ToolState } from './ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { Logger } from '../../utils/Logger.ts';

export abstract class ToolHandler {
  protected abortController = new AbortController();
  protected snapshot: ImageData;

  protected readonly logger: Logger;

  protected get canvas(): HTMLCanvasElement {
    return this.ctx.canvas;
  }

  protected get colour(): string {
    return this.toolState.colour;
  }

  protected get height(): number {
    return this.ctx.canvas.height;
  }

  protected get lineWidth(): number {
    return this.toolState.lineWidth;
  }

  protected get width(): number {
    return this.ctx.canvas.width;
  }

  private get eventListenerOptions(): AddEventListenerOptions {
    return { signal: this.abortController.signal }
  }

  protected constructor(protected readonly ctx: CanvasRenderingContext2D,
                        protected readonly toolState: ToolState,
                        protected readonly layerFacade: LayerFacade) {
    this.snapshot = ctx.getImageData(0, 0, this.width, this.height);
    this.logger = new Logger(this.constructor as Constructor);
  }

  /**
   * A hook to clean up subscriptions and listeners.
   * Called by a rendering system prior to activating a different tool.
   */
  public onDestroy(): void {
    this.logger.log('Destroying an instance.');
    this.abortController?.abort(`Destroying an instance.`);
  }

  /**
   * A hook to establish canvas' listeners and tool's logic for drawing.
   * Called by a rendering system upon activating a tool.
   */
  public onInit(): void {
    this.logger.log('Initializing an instance.');
    this.initializeListeners();
  }

  /**
   * Tries to create a new layer that should be pushed onto the stack.
   * Called by a rendering system prior to destroying a tool.
   */
  public abstract tryCreateLayer(): Layer | null;

  /**
   * Initializes event listeners required for a concrete tool to function.
   * Called during the onInit hook.
   * @protected
   */
  protected abstract initializeListeners(): void;

  protected onClick(handler: (event: MouseEvent) => void): void {
    this.canvas.addEventListener('click', handler, this.eventListenerOptions);
  }

  protected onDoubleClick(handler: (event: MouseEvent) => void): void {
    this.canvas.addEventListener('dblclick', handler, this.eventListenerOptions);
  }

  protected onMove(handler: (event: MouseEvent) => void): void {
    this.canvas.addEventListener('mousemove', handler, this.eventListenerOptions);
  }

  /**
   * Renders the current result of work done by the tool onto the canvas.
   * @protected
   */
  protected render(): void {
    this.logger.log('Rendering preview.');
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.putImageData(this.snapshot, 0, 0);
  }

  protected refreshSnapshot(): void {
    this.snapshot = this.ctx.getImageData(0, 0, this.width, this.height);
  }

  protected reset(): void {
    this.logger.log('Resetting an instance.');
    this.abortController.abort();
    this.abortController = new AbortController();
    this.refreshSnapshot();
  }
}
