import type { GlobalContextState } from '../../../global-provider.tsx';

export type ToolState = Pick<CanvasRenderingContext2D, | 'lineCap' | 'lineJoin'>
  & { fillStyle: string; strokeStyle: string; size: number };

export class ToolStateFactory {
  public static fromState(state: GlobalContextState): ToolState {
    const [red, green, blue] = state.color;
    const colour = `rgb(${red},${green},${blue})`;

    return {
      fillStyle: colour,
      lineCap: 'round',
      lineJoin: 'round',
      size: state.size,
      strokeStyle: colour
    };
  }
}