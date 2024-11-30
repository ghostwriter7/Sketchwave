import type { GlobalContextState } from '../../../global-provider.tsx';
import { stringifyRgb } from '../../../color/stringify-rgb.ts';

export type ToolState = Pick<CanvasRenderingContext2D, | 'lineCap' | 'lineJoin' | 'shadowBlur' | 'shadowColor'>
  & { fillStyle: string; shadowColor: string; strokeStyle: string; size: number, color: [number, number, number]; };

export class ToolStateFactory {
  public static fromState(state: GlobalContextState): ToolState {
    const [red, green, blue] = state.color;
    const colour = `rgb(${red},${green},${blue})`;

    return {
      color: [red, green, blue],
      fillStyle: colour,
      lineCap: 'round',
      lineJoin: 'round',
      size: state.size,
      strokeStyle: colour,
      shadowBlur: 0,
      shadowColor: stringifyRgb(state.color, 0.9)
    };
  }
}
