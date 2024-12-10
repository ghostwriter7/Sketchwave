import type { GlobalContextState, ToolProperties } from '../../../global-provider.tsx';
import { stringifyRgb } from '../../../color/stringify-rgb.ts';

export type ToolState = Pick<CanvasRenderingContext2D, | 'lineCap' | 'lineJoin' | 'shadowBlur' | 'shadowColor'>
  & {
  fillStyle: string;
  shadowColor: string;
  strokeStyle: string;
  size: number,
  color: [number, number, number];
  toolProperties?: ToolProperties
};

export class ToolStateFactory {
  public static fromState(state: GlobalContextState): ToolState {
    const [red, green, blue] = state.color;
    const colour = `rgb(${red},${green},${blue})`;

    return {
      color: [red, green, blue],
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
