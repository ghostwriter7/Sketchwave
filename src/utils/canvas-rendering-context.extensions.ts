import { Color } from '../types/Color.ts';

CanvasRenderingContext2D.prototype.getColorFromPixel = function (x: number, y: number): Color {
  const [red, green, blue, alpha] = this.getImageData(x, y, 1, 1).data;
  return new Color(red, green, blue, alpha);
}
