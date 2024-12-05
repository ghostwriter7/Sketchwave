import type { Point } from '../../../types/Point.ts';
import { ThemeHelper } from '../../../helpers/theme.helper.ts';

export class Resizer {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private currentPath: Path2D | undefined;

  constructor(initialWidth: number, height: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = initialWidth;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.classList.add('shape-resizer');
    document.body.appendChild(this.canvas);

    this.drawAndAnimateBox = this.drawAndAnimateBox.bind(this);
  }

  public renderBoxAt(origin: Point, width: number, height: number): void {
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
    requestAnimationFrame(this.drawAndAnimateBox);
  }
}
