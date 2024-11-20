import { Logger } from '../utils/Logger.ts';
import type { GlobalContextState } from '../global-provider.tsx';

export class CanvasFacade {
  public readonly ctx: CanvasRenderingContext2D;
  private readonly logger = new Logger('CanvasFacade');

  constructor(public readonly canvas: HTMLCanvasElement,
              public readonly state: GlobalContextState,
              private readonly updateState: (state: Partial<GlobalContextState>) => void
  ) {
    this.ctx = new Proxy(canvas.getContext('2d', { willReadFrequently: true })!, {
      get: (target: CanvasRenderingContext2D, property: string) => {
        this.logger.debug(`Retrieving "${property}" from the main ctx.`);
        const value = target[property];
        if (value instanceof Function) {
          return (...args: unknown[]) => value.apply(target, args);
        }
        return value;
      },
      set: (target: CanvasRenderingContext2D, property: string, newValue: any): boolean => {
        this.logger.debug(`Setting "${property}" to "${newValue}" on the main ctx.`);
        target[property] = newValue;
        return true;
      }
    });
  }

  public updateDimensions(width: number, height: number): void {
    this.updateState({ width, height });
  }
}
