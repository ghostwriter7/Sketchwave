import type { GlobalContextState, ToolProperties } from '../../../global-provider.tsx';
import type { RGB } from '../../../types/core.type.ts';
import { Color } from '../../../types/Color.ts';

export type ToolState = Pick<CanvasRenderingContext2D, | 'lineCap' | 'lineJoin' | 'shadowBlur' | 'shadowColor'>
  & {
  alpha: number;
  fillStyle: string;
  shadowColor: string;
  strokeStyle: string;
  scale: number;
  size: number,
  color: Color;
  rgb: RGB;
  toolProperties?: ToolProperties
};

export class ToolStateFactory {
  public static fromState(state: GlobalContextState): ToolState {
    const [red, green, blue] = state.color;
    const rgba = state.color.toString();

    return {
      alpha: state.alpha,
      color: state.color.withAlpha(state.alpha),
      fillStyle: rgba,
      lineCap: state.lineCap || 'round',
      lineJoin: state.lineJoin || 'round',
      scale: state.scale,
      size: state.size,
      strokeStyle: rgba,
      shadowBlur: 0,
      shadowColor: state.color.withAlpha(.9).toString(),
      rgb: [red, green, blue],
      toolProperties: state.toolProperties
    };
  }
}
