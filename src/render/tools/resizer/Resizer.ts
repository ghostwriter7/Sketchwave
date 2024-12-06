import { Point } from '../../../types/Point.ts';
import { ThemeHelper } from '../../../helpers/theme.helper.ts';
import { toRadians } from '../../../math/to-radians.ts';

export class Resizer {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private currentPath?: Path2D;
  private origin!: Point;
  private boxWidth!: number;
  private boxHeight!: number;

  private readonly indicatorDimension = 10;

  private readonly halfIndicatorWidth = this.indicatorDimension / 2;
  private readonly halfIndicatorHeight = this.indicatorDimension / 2;

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
    this.currentPath = new Path2D();
    this.currentPath.rect(origin.x, origin.y, width, height);
    requestAnimationFrame(this.drawAndAnimateBox)
  }

  private drawDashedBox(): void {
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([2, 3]);
    this.ctx.lineDashOffset = this.ctx.lineDashOffset == 10 ? 0 : this.ctx.lineDashOffset + 1;
    this.ctx.stroke(this.currentPath!);
  }

  private drawAndAnimateBox(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawDashedBox();
    this.drawResizeIndicators();
    this.drawRotateHandle();
    requestAnimationFrame(this.drawAndAnimateBox);
  }

  private drawRotateHandle(): void {
    this.ctx.beginPath();
    this.ctx.setLineDash([]);
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = this.ctx.lineJoin =  'round'
    const startX = this.origin.x + 15;

    const startY = this.origin.y + this.boxHeight - 15;

    this.ctx.moveTo(startX + 10, startY);
    this.ctx.arc(startX, startY, 10, 0, toRadians(325));
    this.ctx.lineTo(startX + 1, startY -2);

    this.ctx.moveTo(startX + 10, startY);
    this.ctx.arc(startX, startY, 10, 0, toRadians(325));
    this.ctx.lineTo(startX + 6, startY - 15);

    this.ctx.stroke();
  }

  private drawResizeIndicators(): void {
    const leftX = this.origin.x - this.indicatorDimension;
    const topY = this.origin.y - this.indicatorDimension;
    const centerX = this.origin.x + this.boxWidth * .5 - this.halfIndicatorWidth;
    const centerY = this.origin.y + this.boxHeight * .5 - this.halfIndicatorHeight;
    const endX = this.origin.x + this.boxWidth;
    const endY = this.origin.y + this.boxHeight;

    const points = [
      new Point(leftX, topY),
      new Point(centerX, topY),
      new Point(endX, topY),

      new Point(leftX, centerY),
      new Point(endX, centerY),

      new Point(leftX, endY),
      new Point(centerX, endY),
      new Point(endX, endY)
    ];

    this.ctx.lineDashOffset = 0;
    this.ctx.setLineDash([]);

    points.forEach(({ x, y }: Point) => {
      this.ctx.beginPath();
      this.ctx.fillStyle = '#fff';
      this.ctx.fillRect(x, y, this.indicatorDimension, this.indicatorDimension);
      this.ctx.strokeRect(x, y, this.indicatorDimension, this.indicatorDimension);
    });
  }
}
