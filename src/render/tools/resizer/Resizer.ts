import { Point } from '../../../types/Point.ts';
import { ThemeHelper } from '../../../helpers/theme.helper.ts';
import { toRadians } from '../../../math/to-radians.ts';

type Action = 'move' | 'resize' | 'rotate';

export class Resizer {
  public onMove?: (x: number, y: number) => void;
  public onRotate?: (radians: number) => void;

  private activeAction?: Action;
  private previousActionPoint?: Point;
  private availableAction?: Action;
  private origin!: Point;
  private boxWidth!: number;
  private boxHeight!: number;
  private resizePoints!: Point[];
  private rotationAngle = 0;

  private rotateHandleOrigin!: Point;
  private rotateHandleDimension = 20;

  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly indicatorDimension = 10;
  private readonly halfIndicatorWidth = this.indicatorDimension / 2;
  private readonly halfIndicatorHeight = this.indicatorDimension / 2;
  private readonly cursors = ['nw-resize', 'n-resize', 'ne-resize', 'w-resize', 'e-resize', 'sw-resize', 's-resize', 'se-resize'] as const;


  constructor(width: number, height: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.classList.add('shape-resizer');
    document.body.appendChild(this.canvas);

    this.drawAndAnimateBox = this.drawAndAnimateBox.bind(this);
  }

  public renderBoxAt(origin: Point, width: number, height: number): void {
    this.origin = origin;
    this.boxWidth = width;
    this.boxHeight = height;

    this.ctx.strokeStyle = ThemeHelper.getColor('clr-primary');
    requestAnimationFrame(this.drawAndAnimateBox);

    this.canvas.addEventListener('mousedown', (event) => {
      if (this.availableAction) {
        this.activeAction = this.availableAction;
        this.previousActionPoint = Point.fromEvent(event);
      }
    })

    this.canvas.addEventListener('mouseup', () => {
      this.activeAction = undefined;
    })

    this.canvas.addEventListener('mousemove', (event) => {
      const point = Point.fromEvent(event);

      if (event.buttons == 1 && this.activeAction) {
        const currentPoint = Point.fromEvent(event);
        const dx = currentPoint.x - this.previousActionPoint!.x;
        const dy = currentPoint.y - this.previousActionPoint!.y;
        this.previousActionPoint = currentPoint;

        if (this.activeAction == 'move') {
          this.origin = new Point(this.origin.x + dx, this.origin.y + dy);
          this.onMove?.(dx, dy);
          if (this.rotationAngle) this.onRotate?.(toRadians(this.rotationAngle));
        } else if (this.availableAction == 'rotate') {
          this.rotationAngle -= dx;
          this.rotationAngle %= 360;
          this.onRotate?.(toRadians(this.rotationAngle));
        }
      } else {
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
          }
        }
      }


      //
      // if (this.canResize(point)) {
      //
      // }
      // else if (this.canRotate(point)) {
      //
      // } else if (this.canDrag(point)) {
      //
      // }

    })

  }

  private drawDashedBox(): void {
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([2, 4]);
    this.ctx.lineDashOffset = this.ctx.lineDashOffset == 10 ? 0 : this.ctx.lineDashOffset + 1;
    this.ctx.strokeRect(this.origin.x, this.origin.y, this.boxWidth, this.boxHeight);
  }

  private drawAndAnimateBox(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.rotationAngle) {
      this.ctx.resetTransform();
      const [centerX, centerY] = [this.origin.x + this.boxWidth / 2, this.origin.y + this.boxHeight / 2];
      this.ctx.translate(centerX, centerY);
      const radians = toRadians(this.rotationAngle);
      this.ctx.rotate(radians);
      this.ctx.translate(-centerX, -centerY);
    }
    this.drawDashedBox();
    this.drawResizeIndicators();
    this.drawRotateHandle();
    requestAnimationFrame(this.drawAndAnimateBox);
  }

  private drawRotateHandle(): void {
    this.ctx.beginPath();
    this.ctx.setLineDash([]);
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = this.ctx.lineJoin = 'round'

    this.rotateHandleOrigin = new Point(this.origin.x + 5, this.origin.y + this.boxHeight - 25);

    this.ctx.moveTo(this.rotateHandleOrigin.x + 20, this.rotateHandleOrigin.y + 10);
    this.ctx.arc(this.rotateHandleOrigin.x + 10, this.rotateHandleOrigin.y + 10, 10, 0, toRadians(325));
    this.ctx.lineTo(this.rotateHandleOrigin.x + 11, this.rotateHandleOrigin.y + 8);

    this.ctx.moveTo(this.rotateHandleOrigin.x + 20, this.rotateHandleOrigin.y + 10);
    this.ctx.arc(this.rotateHandleOrigin.x + 10, this.rotateHandleOrigin.y + 10, 10, 0, toRadians(325));
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
}
