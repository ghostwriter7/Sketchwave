import { Color } from '../types/Color.ts';
import { Point } from '../types/Point.ts';

CanvasRenderingContext2D.prototype.getColorFromPixel = function (x: number, y: number): Color {
  const [red, green, blue, alpha] = this.getImageData(x, y, 1, 1).data;
  return new Color(red, green, blue, alpha);
}

CanvasRenderingContext2D.prototype.rotateCanvas = function (origin: Point, radians: number): void {
  this.resetTransform();
  this.translate(origin.x, origin.y);
  this.rotate(radians);
  this.translate(-origin.x, -origin.y);
}
