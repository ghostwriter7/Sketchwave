import { ToolHandler } from './ToolHandler.ts';
import type { ToolState } from '../models/ToolState.ts';
import type { LayerFacade } from '../../LayerFacade.ts';
import { Point } from '../../primitives/Point.ts';

export abstract class SimpleTool extends ToolHandler {
  protected isWorking = false;
  protected points: Point[] = [];
  protected lastPointIndex = 0;

  protected constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }

  protected initializeListeners(): void {
    this.onMouseDown((event) => {
      this.isWorking = true;
      this.points.push(Point.fromEvent(event));
      this.renderPreview();
    });

    this.onMouseUp(() => this.resetState());
    this.onMouseLeave(() => this.resetState());

    this.onMove((event) => {
      if (!this.isWorking) return;
      this.points.push(Point.fromEvent(event));
      this.renderPreview();
    });
  }

  protected resetState(): void {
    this.isWorking = false;
    if (this.points.length === 0) return;
    this.tryCreateLayer();
    this.points = [];
    this.lastPointIndex = 0;
  }
}
