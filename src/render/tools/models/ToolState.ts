import type { GlobalContextState, ToolProperties } from '../../../global-provider.tsx';
import { stringifyRgb } from '../../../color/stringify-rgb.ts';
import type { RGBa } from '../../../types/core.type.ts';

export type ToolState = Pick<CanvasRenderingContext2D, | 'lineCap' | 'lineJoin' | 'shadowBlur' | 'shadowColor'>
  & {
  fillStyle: string;
  shadowColor: string;
  strokeStyle: string;
  size: number,
  color: RGBa;
  toolProperties?: ToolProperties
};

export class ToolStateFactory {
  public static fromState(state: GlobalContextState): ToolState {
    const [red, green, blue, alpha] = state.color;
    const colour = `rgb(${red},${green},${blue},${alpha})`;

    return {
      color: [red, green, blue, alpha],
      fillStyle: colour,
      lineCap: state.lineCap || 'round',
      lineJoin: state.lineJoin || 'round',
      size: state.size,
      strokeStyle: colour,
      shadowBlur: 0,
      shadowColor: stringifyRgb([red, green, blue, 0.9]),
      toolProperties: state.toolProperties
    };
  }
}
