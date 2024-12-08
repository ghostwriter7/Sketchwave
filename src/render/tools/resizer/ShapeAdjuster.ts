import { Point } from '../../../types/Point.ts';
import { ThemeHelper } from '../../../helpers/theme.helper.ts';
import { toRadians } from '../../../math/to-radians.ts';
import { RESIZE_ACTIONS, RESIZE_CURSORS } from '../../../types/cursors.ts';
import { ScaleChangeEvent } from '../../../types/events.ts';

type Action = 'move' | 'resize' | 'rotate';

export class ShapeAdjuster {
  private activeAction?: Action;
  private previousActionPoint?: Point;
  private availableAction?: Action;
  private origin!: Point;
  private boxWidth!: number;
  private boxHeight!: number;
  private resizePoints!: Point[];
  private rotationAngle = 0;
  private rotationAngleInRadians = 0;

  private rotateHandleOrigin!: Point;
  private rotateHandleDimension = 20;

  private readonly abortController = new AbortController();
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  private readonly indicatorDimension = 10;
  private readonly halfIndicatorWidth = this.indicatorDimension / 2;
  private readonly halfIndicatorHeight = this.indicatorDimension / 2;

  private readonly cursors = RESIZE_CURSORS;
  private readonly cursorActionMap = RESIZE_ACTIONS;

  constructor(
    readonly width: number,
    readonly height: number,
    private readonly rootCanvas: HTMLCanvasElement,
    private readonly onChange: (origin: Point, width: number, height: number, angle: number,) => void,
    private readonly onComplete: () => void,
    private readonly minimalSize: number,
  ) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.classList.add('shape-resizer');
    document.body.appendChild(this.canvas);
  }

  public destroy(): void {
    this.abortController.abort('Destroying ShapeAdjuster...');
    this.canvas.remove();
  }

  public renderBoxBetweenStartAndEndPoints(origin: Point, endPoint: Point): void {
    this.origin = origin;
    this.boxWidth = endPoint.x - origin.x;
    this.boxHeight = endPoint.y - origin.y;
    this.ctx.strokeStyle = ThemeHelper.getColor('clr-primary');

    this.drawBoxAndControls();
    this.initializeEventListeners();
  }

  private drawDashedBox(): void {
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([4, 4]);
    this.ctx.strokeRect(this.origin.x, this.origin.y, this.boxWidth, this.boxHeight);
  }

  private drawBoxAndControls(): void {
    this.ctx.resetTransform();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.rotationAngleInRadians) {
      const [centerX, centerY] = [this.origin.x + this.boxWidth / 2, this.origin.y + this.boxHeight / 2];
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate(this.rotationAngleInRadians);
      this.ctx.translate(-centerX, -centerY);
    }

    this.drawDashedBox();
    this.drawResizeIndicators();
    this.drawRotateHandle();
  }

  private drawRotateHandle(): void {
    this.ctx.beginPath();
    this.ctx.setLineDash([]);
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = this.ctx.lineJoin = 'round'

    this.rotateHandleOrigin = new Point(this.origin.x + 5, this.origin.y + this.boxHeight - 25);

    const angle = toRadians(325);
    this.ctx.moveTo(this.rotateHandleOrigin.x + 20, this.rotateHandleOrigin.y + 10);
    this.ctx.arc(this.rotateHandleOrigin.x + 10, this.rotateHandleOrigin.y + 10, 10, 0, angle);
    this.ctx.lineTo(this.rotateHandleOrigin.x + 11, this.rotateHandleOrigin.y + 8);

    this.ctx.moveTo(this.rotateHandleOrigin.x + 20, this.rotateHandleOrigin.y + 10);
    this.ctx.arc(this.rotateHandleOrigin.x + 10, this.rotateHandleOrigin.y + 10, 10, 0, angle);
    this.ctx.lineTo(this.rotateHandleOrigin.x + 16, this.rotateHandleOrigin.y - 5);

    this.ctx.stroke();
  }

  private drawResizeIndicators(): void {
    const leftX = this.origin.x - this.indicatorDimension;
    const topY = this.origin.y - this.indicatorDimension;
    const centerX = this.origin.x + this.boxWidth * .5 - this.halfIndicatorWidth;
    const centerY = this.origin.y + this.boxHeight * .5 - this.halfIndicatorHeight;
    const endX = this.origin.x + this.boxWidth;
    const endY = this.origin.y + this.boxHeight;

    this.resizePoints = [
      new Point(leftX, topY),
      new Point(centerX, topY),
      new Point(endX, topY),

      new Point(leftX, centerY),
      new Point(endX, centerY),

      new Point(leftX, endY),
      new Point(centerX, endY),
      new Point(endX, endY)
    ];

    this.ctx.setLineDash([]);

    this.resizePoints.forEach(({ x, y }: Point) => {
      this.ctx.beginPath();
      this.ctx.fillStyle = '#fff';
      this.ctx.fillRect(x, y, this.indicatorDimension, this.indicatorDimension);
      this.ctx.strokeRect(x, y, this.indicatorDimension, this.indicatorDimension);
    });
  }

  private initializeEventListeners(): void {
    const options = { signal: this.abortController.signal };

    this.canvas.addEventListener('mousedown', this.handleClick.bind(this), options)
    this.canvas.addEventListener('mouseup', () => this.activeAction = undefined, options)
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this), options);

    this.canvas.style.transform = this.rootCanvas.style.transform;
    this.rootCanvas.addEventListener(ScaleChangeEvent.NAME, (event: ScaleChangeEvent) => {
      this.canvas.style.transform = `scale(${event.detail.scale})`
    }, options);
  }

  private handleClick(event: MouseEvent): void {
    if (this.availableAction) {
      this.activeAction = this.availableAction;
      this.previousActionPoint = Point.fromEvent(event);
    } else {
      this.onComplete();
      this.destroy();
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    const point = Point.fromEvent(event)

    if (event.buttons == 1 && this.activeAction) {
      this.performAction(point);
    } else {
      this.adjustAvailableAction(point);
    }
  }

  private performAction(point: Point): void {
    const dx = point.x - this.previousActionPoint!.x;
    const dy = point.y - this.previousActionPoint!.y;
    this.previousActionPoint = point;

    if (this.activeAction == 'move') {
      this.handleMoveAction(dx, dy);
    } else if (this.availableAction == 'rotate') {
      this.handleRotateAction(dx);
    } else if (this.availableAction == 'resize') {
      this.handleResizeAction(dx, dy);
    }

    this.drawBoxAndControls();
    this.onChange(this.origin, this.boxWidth, this.boxHeight, this.rotationAngleInRadians);
  }

  private handleRotateAction(dx: number): void {
    this.rotationAngle -= dx;
    this.rotationAngle %= 360;
    this.rotationAngleInRadians = toRadians(this.rotationAngle);
  }

  private adjustAvailableAction(point: Point): void {
    if (this.rotationAngleInRadians) {
      const tempPoint = new DOMPoint(point.x, point.y);
      point = tempPoint.matrixTransform(this.ctx.getTransform().inverse());
    }

    if (Point.isWithinBoundingBox(point, this.rotateHandleOrigin, this.rotateHandleDimension, this.rotateHandleDimension)) {
      this.canvas.style.cursor = 'grab';
      this.availableAction = 'rotate';
    } else if (Point.isWithinBoundingBox(point, this.origin, this.boxWidth, this.boxHeight)) {
      this.canvas.style.cursor = 'move';
      this.availableAction = 'move';
    } else {
      const resizeCursorIndex = this.resizePoints.findIndex((resizePoint) =>
        Point.isWithinBoundingBox(point, resizePoint, this.indicatorDimension, this.indicatorDimension)
      );

      if (resizeCursorIndex != -1) {
        this.canvas.style.cursor = this.cursors[resizeCursorIndex];
        this.availableAction = 'resize';
      } else {
        this.canvas.style.cursor = 'default';
        this.availableAction = undefined;
      }
    }
  }

  private handleResizeAction(dx: number, dy: number) {
    const activeCursor = this.canvas.style.cursor;
    const availableActions = this.cursorActionMap[activeCursor];

    const angle = this.rotationAngleInRadians;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const localDx = cosAngle * dx + sinAngle * dy;
    const localDy = -sinAngle * dx + cosAngle * dy;

    if (availableActions.originX && this.boxWidth > this.minimalSize) {
      this.origin = new Point(this.origin.x + localDx, this.origin.y)
    }

    if (availableActions.originY && this.boxHeight > this.minimalSize) {
      this.origin = new Point(this.origin.x, this.origin.y + localDy)
    }

    if (availableActions.width) {
      this.boxWidth += localDx * availableActions.width;
      if (this.boxWidth < this.minimalSize) this.boxWidth = this.minimalSize;
    }

    if (availableActions.height) {
      this.boxHeight += localDy * availableActions.height;
      if (this.boxHeight < this.minimalSize) this.boxHeight = this.minimalSize;
    }
  }

  private handleMoveAction(dx: number, dy: number): void {
    this.origin = new Point(this.origin.x + dx, this.origin.y + dy);
  }
}
