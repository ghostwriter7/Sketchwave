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
import type { ToolProperties } from '../../../global-provider.tsx';
import { AdjustableToolHandler } from '../abstract/AdjustableToolHandler.ts';

export class ShapeTool extends AdjustableToolHandler {
  protected nativeCursor = 'crosshair';

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
    const roundCorners = toolState.toolProperties!.arc === 'round';
    super({
      ...toolState, ...(toolState.toolProperties!.outline === 'solid' && {
        lineCap: roundCorners ? 'round' : 'square',
        lineJoin: roundCorners ? 'round' : 'miter'
      })
    }, layerFacade);

  }

  public tryCreateLayer(): void {
    if (!this.startPoint || !this.endPoint) return;

    const pathOrPoints = this.getPathOrPoints();
    const { fill, outline, arc } = this.toolState.toolProperties!;
    const radius = this.lineWidth / 2;
    const rotate = this.rotateAngleInRadians;
    const startPoint = this.startPoint;
    const { dx, dy } = Point.delta(startPoint, this.endPoint);

    this.createLayer((ctx: CanvasRenderingContext2D) =>
      ShapeTool.render(ctx, pathOrPoints, { fill, outline, arc, radius, rotate, startPoint, width: dx, height: dy })
    );
  }

  protected initializeListeners(): void {
    this.onClick((event) => {
      this.isWorking = true;
      if (!this.startPoint) {
        this.startPoint = Point.fromEvent(event);
      } else {
        this.endPoint = Point.fromEvent(event);
        this.renderPreview();

        this.shapeAdjuster = this.createShapeAdjuster();

        const [startPoint, endPoint] = this.getAdjustedStartAndEndPoints();
        this.startPoint = startPoint;
        this.endPoint = endPoint;

        this.shapeAdjuster.renderBoxBetweenStartAndEndPoints(startPoint, endPoint);
      }
    });

    this.onMove((event) => {
      if (!this.isWorking) return;
      this.endPoint = Point.fromEvent(event);
      this.renderPreview();
    });
  }

  protected renderPreview(): void {
    if (!this.startPoint || !this.endPoint) return;
    super.renderPreview();

    const pathOrPoints = this.getPathOrPoints();
    const { fill, arc, outline } = this.toolState.toolProperties!;
    ShapeTool.render(this.ctx, pathOrPoints, {
      fill,
      arc,
      outline,
      radius: this.lineWidth / 2,
      startPoint: this.startPoint,
      width: this.endPoint.x - this.startPoint.x,
      height: this.endPoint.y - this.startPoint.y,
    });
  }

  protected onComplete(): void {
    if (!this.isWorking) return;
    this.tryCreateLayer();
    this.isWorking = false;
    this.startPoint = undefined;
    this.endPoint = undefined;
    this.rotateAngleInRadians = undefined;
    this.ctx.resetTransform();
  }

  private getPathOrPoints(): Path2D | Point[] {
    const [startPoint, endPoint] = this.getAdjustedStartAndEndPoints();

    const { dx, dy } = Point.delta(startPoint, endPoint);

    return this.createPointsForShapeFn?.(startPoint!, endPoint!, dx, dy)
      || this.createPathForShapeFn?.(startPoint!, endPoint!, dx, dy) as Point[] | Path2D;

  }

  private static render(ctx: CanvasRenderingContext2D,
                        pathOrPoints: Point[] | Path2D,
                        {
                          fill,
                          arc,
                          radius,
                          outline,
                          rotate,
                          startPoint,
                          width,
                          height
                        }: Pick<ToolProperties, 'arc' | 'fill' | 'outline'> & {
                          radius: number; rotate?: number; startPoint: Point, width: number, height: number
                        }): void {
    if (rotate) {
      const [centerX, centerY] = [startPoint.x + width / 2, startPoint.y + height / 2];
      ctx.resetTransform();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotate);
      ctx.translate(-centerX, -centerY);
    }

    const solidFill = fill === 'solid';
    const solidOutline = outline === 'solid';

    if (arc === 'round' && Array.isArray(pathOrPoints)) {
      solidFill && ctx.fill(createRoundedPath(pathOrPoints, radius));
      solidOutline && ctx.stroke(createPathFromPoints(pathOrPoints));
    } else {
      const path = pathOrPoints instanceof Path2D ? pathOrPoints : createPathFromPoints(pathOrPoints);
      solidFill && ctx.fill(path);
      solidOutline && ctx.stroke(path);
    }
  }

  private getAdjustedStartAndEndPoints(): [Point, Point] {
    let startPoint = new Point(Math.min(this.startPoint!.x, this.endPoint!.x), Math.min(this.startPoint!.y, this.endPoint!.y));
    let endPoint = new Point(Math.max(this.startPoint!.x, this.endPoint!.x), Math.max(this.startPoint!.y, this.endPoint!.y));

    const { dx, dy } = Point.delta(startPoint, endPoint);

    if (dx < this.MINIMAL_SIZE) {
      const remaining = Math.ceil((this.MINIMAL_SIZE - dx) / 2);
      startPoint = new Point(startPoint.x - remaining, startPoint.y);
      endPoint = new Point(endPoint.x + remaining, endPoint.y);
    }

    if (dy < this.MINIMAL_SIZE) {
      const remaining = Math.ceil((this.MINIMAL_SIZE - dy) / 2);
      startPoint = new Point(startPoint.x, startPoint.y - remaining);
      endPoint = new Point(endPoint.x, endPoint.y + remaining);
    }

    return [startPoint, endPoint];
  }
}
