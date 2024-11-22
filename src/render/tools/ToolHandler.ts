import type { Constructor } from '../../types/core.type.ts';
import type { ToolState } from './ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { Logger } from '../../utils/Logger.ts';

type EventHandler = (event: MouseEvent) => void;

export abstract class ToolHandler {
  protected abortController = new AbortController();

  protected readonly logger = new Logger(this.constructor as Constructor);

  protected get canvas(): HTMLCanvasElement {
    return this.ctx.canvas;
  }

  protected get colour(): string {
    return this.toolState.colour;
  }

  protected get ctx(): CanvasRenderingContext2D {
    return this.layerFacade.ctx;
  }

  protected get height(): number {
    return this.ctx.canvas.height;
  }

  protected get lineWidth(): number {
    return this.toolState.lineWidth;
  }

  protected get name(): string {
    return this.constructor.name.toTitleCase();
  }

  protected get width(): number {
    return this.ctx.canvas.width;
  }

  private get eventListenerOptions(): AddEventListenerOptions {
    return { signal: this.abortController.signal }
  }

  protected constructor(protected readonly toolState: ToolState,
                        protected readonly layerFacade: LayerFacade) {
    this.onInit();
  }

  /**
   * A hook to clean up subscriptions and listeners.
   * Called by a rendering system prior to activating a different tool.
   */
  public onDestroy(): void {
    this.logger.log('Destroying an instance.');
    this.abortController?.abort(`Destroying an instance.`);
    this.tryCreateLayer();
    this.canvas.style.cursor = 'pointer';
  }

  /**
   * A hook to establish canvas' listeners and tool's logic for drawing.
   * Called by a rendering system upon activating a tool.
   */
  protected async onInit(): Promise<void> {
    this.logger.log('Initializing an instance.');
    this.initializeListeners();
    this.canvas.style.cursor = await this.getCustomCursor();
  }

  /**
   * Tries to create a new layer that should be pushed onto the stack.
   * Called by a rendering system prior to destroying a tool.
   */
  public abstract tryCreateLayer(): void;

  /**
   * Initializes event listeners required for a concrete tool to function.
   * Called during the onInit hook.
   * @protected
   */
  protected abstract initializeListeners(): void;

  protected onClick(handler: EventHandler): void {
    this.canvas.addEventListener('click', handler, this.eventListenerOptions);
  }

  protected onDoubleClick(handler: EventHandler): void {
    this.canvas.addEventListener('dblclick', handler, this.eventListenerOptions);
  }

  protected onMove(handler: EventHandler): void {
    this.canvas.addEventListener('mousemove', handler, this.eventListenerOptions);
  }

  protected onMouseDown(handler: EventHandler): void {
    this.canvas.addEventListener('mousedown', handler, this.eventListenerOptions);
  }

  protected onMouseUp(handler: EventHandler): void {
    this.canvas.addEventListener('mouseup', handler, this.eventListenerOptions);
  }

  /**
   * Renders the current result of work done by the tool onto the canvas.
   * @protected
   */
  protected renderPreview(): void {
    this.logger.debug('Rendering preview.');
    this.layerFacade.renderLayers();
  }

  protected reset(): void {
    this.logger.log('Resetting an instance.');
    this.abortController.abort();
    this.abortController = new AbortController();
  }

  /**
   *
   * Should return a Data URL representing a custom cursor for a given tool
   * @protected
   */
  protected async getCustomCursor(): Promise<string> {
    return Promise.resolve('pointer');
  }
}
