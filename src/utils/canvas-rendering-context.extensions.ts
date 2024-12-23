import { Color } from '../types/Color.ts';
import { Point } from '../types/Point.ts';
import type { Gradient } from '../components/gradient-generator/gradient-generator.tsx';

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

const createGradient = function (this: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, gradient: Gradient, origin: Point, width: number, height: number): CanvasGradient {
  let canvasGradient: CanvasGradient;

  switch (gradient.gradientType) {
    case 'linear':
      canvasGradient = this.createLinearGradient(0, 0, width, 0);
      break;
    case 'radial': {
      const centerX = origin.x + width / 2;
      const centerY = origin.y + height / 2;
      canvasGradient = this.createRadialGradient(centerX, centerY, 1, centerX, centerY, Math.min(width, height) / 2);
      break;
    }
    case 'conic':
      canvasGradient = this.createConicGradient(0, origin.x + width / 2, origin.y + height / 2);
      break;
  }

  gradient.gradientDefinitions.forEach((def) => canvasGradient.addColorStop(def.stop, def.color.toString()));

  return canvasGradient;
}

CanvasRenderingContext2D.prototype.createGradient = OffscreenCanvasRenderingContext2D.prototype.createGradient = createGradient;
