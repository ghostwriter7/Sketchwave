import type { GlobalContextState, ToolProperties } from '../../../global-provider.tsx';
import { stringifyRgb } from '../../../color/stringify-rgb.ts';
import type { RGB, RGBA } from '../../../types/core.type.ts';

export type ToolState = Pick<CanvasRenderingContext2D, | 'lineCap' | 'lineJoin' | 'shadowBlur' | 'shadowColor'>
  & {
  alpha: number;
  fillStyle: string;
  shadowColor: string;
  strokeStyle: string;
  size: number,
  color: RGBA;
  rgb: RGB;
  toolProperties?: ToolProperties
};

export class ToolStateFactory {
  public static fromState(state: GlobalContextState): ToolState {
    const [red, green, blue] = state.color;
    const color = `rgb(${red},${green},${blue},${state.alpha})`;

    return {
      alpha: state.alpha,
      color: [...state.color, state.alpha],
      fillStyle: color,
      lineCap: state.lineCap || 'round',
      lineJoin: state.lineJoin || 'round',
      size: state.size,
      strokeStyle: color,
      shadowBlur: 0,
      shadowColor: stringifyRgb([...state.color, Math.min(state.alpha, .9)]),
      rgb: state.color,
      toolProperties: state.toolProperties
    };
  }
}
