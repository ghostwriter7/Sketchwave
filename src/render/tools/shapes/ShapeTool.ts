import { ToolHandler } from '../abstract/ToolHandler.ts';
import type { ToolState } from '../models/ToolState.ts';
import { type LayerFacade } from '../../LayerFacade.ts';
import { Point } from '../../../types/Point.ts';
import { rect } from './get-points-for-shape-fns/rect.ts';
import { triangle } from './get-points-for-shape-fns/triangle.ts';
import type { CreatePointsForShapeFn, ShapeType } from '../../../types/core.type.ts';
import { star } from './get-points-for-shape-fns/star.ts';
import { diamond } from './get-points-for-shape-fns/diamond.ts';
import { createRoundedPath } from './utils/create-rounded-path.ts';
import { createPathFromPoints } from './utils/create-path-from-points.ts';
import { bolt } from './get-points-for-shape-fns/bolt.ts';

export class ShapeTool extends ToolHandler {
  private startPoint: Point | null = null;
  private endPoint: Point | null = null;
  private isWorking = false;

  private static shapeFnsMap: Record<ShapeType, CreatePointsForShapeFn> = {
    bolt: bolt,
    diamond: diamond,
    rect: rect,
    star: star,
    triangle: triangle,
  }

  private get createPointsForShapeFn(): CreatePointsForShapeFn {
    return ShapeTool.shapeFnsMap[this.toolState.toolProperties!.shapeType!];
  }

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }

  public tryCreateLayer(): void {
  }

  protected initializeListeners(): void {
    this.onMouseDown((event) => {
      this.isWorking = true;
      this.startPoint = Point.fromEvent(event);
    });

    this.onMove((event) => {
      this.endPoint = Point.fromEvent(event);
      this.renderPreview();
    });

    const reset = () => this.resetState();
    this.onMouseUp(reset);
    this.onMouseLeave(reset);
  }

  protected renderPreview(): void {
    if (!this.startPoint || !this.endPoint) return;
    super.renderPreview();

    const points = this.createPointsForShapeFn(this.startPoint, this.endPoint);


    if (this.toolState.toolProperties!.round) {
      if (this.toolState.toolProperties!.fill) {
        const dx = this.endPoint.x - this.startPoint.x;
        const dy = this.endPoint.y - this.startPoint.y;
        this.ctx.fill(createRoundedPath(points, dx, dy))
      }

      if (this.toolState.toolProperties!.stroke) {
        this.ctx.lineJoin = this.ctx.lineCap = 'round';
        this.ctx.stroke(createPathFromPoints(points));
      }

    } else {
      const path = createPathFromPoints(points);

      if (this.toolState.toolProperties!.fill) {
        this.ctx.fill(path);
      }

      if (this.toolState.toolProperties!.stroke) {
        this.ctx.lineJoin = 'miter';
        this.ctx.lineCap = 'square';
        this.ctx.stroke(path);
      }
    }
  }

  private resetState(): void {
    if (!this.isWorking) return;
    this.tryCreateLayer();
    this.startPoint = null;
    this.endPoint = null;
  }
}
