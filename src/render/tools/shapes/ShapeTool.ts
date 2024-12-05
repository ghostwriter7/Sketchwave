import { ToolHandler } from '../abstract/ToolHandler.ts';
import type { ToolState } from '../models/ToolState.ts';
import { type LayerFacade } from '../../LayerFacade.ts';
import { Point } from '../../../types/Point.ts';
import { rect } from './create-points-for-shape-fns/rect.ts';
import { triangle } from './create-points-for-shape-fns/triangle.ts';
import type {
  ComplexShapeType,
  CreatePathForShapeFn,
  CreatePointsForShapeFn,
  SimpleShapeType
} from '../../../types/core.type.ts';
import { star } from './create-points-for-shape-fns/star.ts';
import { diamond } from './create-points-for-shape-fns/diamond.ts';
import { createRoundedPath } from './utils/create-rounded-path.ts';
import { createPathFromPoints } from './utils/create-path-from-points.ts';
import { bolt } from './create-points-for-shape-fns/bolt.ts';
import { arrow } from './create-points-for-shape-fns/arrow.ts';
import { checkmark } from './create-points-for-shape-fns/checkmark.ts';
import { heart } from './create-path-for-shape-fns/heart.ts';
import { circle } from './create-path-for-shape-fns/circle.ts';
import { halfMoon } from './create-path-for-shape-fns/halfMoon.ts';
import { notifications } from './create-path-for-shape-fns/notifications.ts';
import { person } from './create-path-for-shape-fns/person.ts';

export class ShapeTool extends ToolHandler {
  private startPoint: Point | null = null;
  private endPoint: Point | null = null;
  private isWorking = false;

  private static readonly createPointsForShapeFnMap: Record<SimpleShapeType, CreatePointsForShapeFn> = {
    arrow: arrow,
    bolt: bolt,
    checkmark: checkmark,
    diamond: diamond,
    rect: rect,
    star: star,
    triangle: triangle,
  }

  private static readonly createPathForShapeFnMap: Record<ComplexShapeType, CreatePathForShapeFn> = {
    circle: circle,
    halfMoon: halfMoon,
    heart: heart,
    notifications: notifications,
    person: person
  }

  private get createPointsForShapeFn(): CreatePointsForShapeFn | undefined {
    return ShapeTool.createPointsForShapeFnMap[this.toolState.toolProperties!.shapeType as SimpleShapeType];
  }

  private get createPathForShapeFn(): CreatePathForShapeFn | undefined {
    return ShapeTool.createPathForShapeFnMap[this.toolState.toolProperties!.shapeType as ComplexShapeType];
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

    if (!!this.createPointsForShapeFn) {
      this.renderSimpleShape();
    } else {
      this.renderComplexShape();
    }
  }

  private renderSimpleShape(): void {
    if (!this.startPoint || !this.endPoint) return;

    const dx = this.endPoint.x - this.startPoint.x;
    const dy = this.endPoint.y - this.startPoint.y;
    const points = this.createPointsForShapeFn!(this.startPoint, this.endPoint, dx, dy);

    if (this.toolState.toolProperties!.round) {
      this.toolState.toolProperties!.fill && this.ctx.fill(createRoundedPath(points, this.lineWidth / 2));
      this.toolState.toolProperties!.stroke && this.ctx.stroke(createPathFromPoints(points));
    } else {
      const path = createPathFromPoints(points);
      this.toolState.toolProperties!.fill && this.ctx.fill(path);
      this.toolState.toolProperties!.stroke && this.ctx.stroke(path);
    }
  }

  private renderComplexShape(): void {
    if (!this.startPoint || !this.endPoint) return;

    const dx = this.endPoint.x - this.startPoint.x;
    const dy = this.endPoint.y - this.startPoint.y;
    const path = this.createPathForShapeFn!(this.startPoint, this.endPoint, dx, dy);
    this.toolState.toolProperties!.fill && this.ctx.fill(path)
    this.toolState.toolProperties!.stroke && this.ctx.stroke(path);
  }

  private resetState(): void {
    if (!this.isWorking) return;
    this.tryCreateLayer();
    this.startPoint = null;
    this.endPoint = null;
  }
}
