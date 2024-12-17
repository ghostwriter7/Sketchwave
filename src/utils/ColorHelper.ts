import type { RGBA } from '../types/core.type.ts';
import type { Color } from '../types/Color.ts';

export class ColorHelper {
  static findClosestColorIndexInRange(color: Color, colors: RGBA[]): number {
    const [red, green, blue] = color;
    return colors.reduce((acc, color, index) => {
      const squaredDistance = Math.pow(red - color[0], 2) + Math.pow(green - color[1], 2) + Math.pow(blue - color[2], 2);
      return squaredDistance < acc.distance ? { distance: squaredDistance, index } : acc;
    }, { distance: Infinity, index: -1 }).index;
  }
}
