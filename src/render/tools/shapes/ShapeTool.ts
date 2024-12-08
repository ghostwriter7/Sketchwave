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
import type { ToolProperties } from '../../../global-provider.tsx';
import { ShapeAdjuster } from '../resizer/ShapeAdjuster.ts';

export class ShapeTool extends ToolHandler {
  protected nativeCursor = 'crosshair';

  private startPoint: Point | null = null;
  private endPoint: Point | null = null;
  private isWorking = false;
  private rotateAngleInRadians?: number;
  private shapeAdjuster?: ShapeAdjuster;

  private readonly MINIMAL_SIZE = 30;

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

  public override onDestroy(): void {
    super.onDestroy();
    this.shapeAdjuster?.destroy();
  }

  public tryCreateLayer(): void {
    if (!this.startPoint || !this.endPoint) return;

    const pathOrPoints = this.getPathOrPoints();
    const { fill, stroke, round } = this.toolState.toolProperties!;
    const radius = this.lineWidth / 2;
    const rotate = this.rotateAngleInRadians;
    const startPoint = this.startPoint;
    const { dx, dy } = Point.delta(startPoint, this.endPoint);

    this.createLayer((ctx: CanvasRenderingContext2D) =>
      ShapeTool.render(ctx, pathOrPoints, { fill, stroke, round, radius, rotate, startPoint, width: dx, height: dy })
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

        this.shapeAdjuster = new ShapeAdjuster(
          this.width,
          this.height,
          this.layerFacade.ctx.canvas,
          this.handleShapeAdjustment.bind(this),
          () => this.resetState(),
          this.MINIMAL_SIZE
        );

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
    const { fill, stroke, round } = this.toolState.toolProperties!;
    ShapeTool.render(this.ctx, pathOrPoints, {
      fill,
      stroke,
      round,
      radius: this.lineWidth / 2,
      startPoint: this.startPoint,
      width: this.endPoint.x - this.startPoint.x,
      height: this.endPoint.y - this.startPoint.y,
    });
  }

  private resetState(): void {
    if (!this.isWorking) return;
    this.tryCreateLayer();
    this.isWorking = false;
    this.startPoint = null;
    this.endPoint = null;
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
                          stroke,
                          radius,
                          round,
                          rotate,
                          startPoint,
                          width,
                          height
                        }: Pick<ToolProperties, 'round' | 'fill' | 'stroke'> & {
                          radius: number; rotate?: number; startPoint: Point, width: number, height: number
                        }): void {
    if (rotate) {
      const [centerX, centerY] = [startPoint.x + width / 2, startPoint.y + height / 2];
      ctx.resetTransform();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotate);
      ctx.translate(-centerX, -centerY);
    }
    if (round && Array.isArray(pathOrPoints)) {
      fill && ctx.fill(createRoundedPath(pathOrPoints, radius));
      stroke && ctx.stroke(createPathFromPoints(pathOrPoints));
    } else {
      const path = pathOrPoints instanceof Path2D ? pathOrPoints : createPathFromPoints(pathOrPoints);
      fill && ctx.fill(path);
      stroke && ctx.stroke(path);
    }
  }

  private handleShapeAdjustment(origin: Point, width: number, height: number, angle: number): void {
    this.startPoint = origin;
    this.endPoint = new Point(origin.x + width, origin.y + height);

    const { dx, dy } = Point.delta(this.startPoint, this.endPoint);
    this.rotateAngleInRadians = angle;
    const [centerX, centerY] = [this.startPoint!.x + dx / 2, this.startPoint!.y + dy / 2];
    this.ctx.resetTransform();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(angle);
    this.ctx.translate(-centerX, -centerY);
    this.renderPreview();
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
