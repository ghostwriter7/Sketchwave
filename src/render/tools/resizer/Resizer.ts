import { Point } from '../../../types/Point.ts';
import { ThemeHelper } from '../../../helpers/theme.helper.ts';

export class Resizer {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private currentPath?: Path2D;
  private origin!: Point;
  private boxWidth!: number;
  private boxHeight!: number;

  private readonly indicatorWidth = 10;
  private readonly indicatorHeight = 10;

  private readonly halfIndicatorWidth = this.indicatorWidth / 2;
  private readonly halfIndicatorHeight = this.indicatorHeight / 2;

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

    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([2, 3]);
    this.ctx.strokeStyle = ThemeHelper.getColor('clr-primary');
    this.currentPath = new Path2D();
    this.currentPath.rect(origin.x, origin.y, width, height);
    requestAnimationFrame(this.drawAndAnimateBox)
  }

  private drawAndAnimateBox(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineDashOffset = this.ctx.lineDashOffset == 10 ? 0 : this.ctx.lineDashOffset + 1;
    this.ctx.stroke(this.currentPath!);
    this.drawResizeIndicators();
    requestAnimationFrame(this.drawAndAnimateBox);
  }

  private drawResizeIndicators(): void {
    const leftX = this.origin.x - this.indicatorWidth;
    const topY = this.origin.y - this.indicatorHeight;
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

    points.forEach(({ x, y }: Point) => {
      this.ctx.beginPath();
      this.ctx.fillStyle = ThemeHelper.getColor('clr-primary');
      this.ctx.fillRect(x, y, this.indicatorWidth, this.indicatorHeight);
    });
  }
}
