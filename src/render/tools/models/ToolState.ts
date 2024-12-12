import type { GlobalContextState, ToolProperties } from '../../../global-provider.tsx';
import type { RGB, RGBA } from '../../../types/core.type.ts';
import { Color } from '../../../types/Color.ts';

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
    const color = new Color(...state.color, state.alpha);
    const rgba = color.toString();

    return {
      alpha: state.alpha,
      color: [...state.color, state.alpha],
      fillStyle: rgba,
      lineCap: state.lineCap || 'round',
      lineJoin: state.lineJoin || 'round',
      size: state.size,
      strokeStyle: rgba,
      shadowBlur: 0,
      shadowColor: color.withAlpha(.9).toString(),
      rgb: state.color,
      toolProperties: state.toolProperties
    };
  }
}
