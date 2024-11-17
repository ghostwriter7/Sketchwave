import type { GlobalContextState } from '../../global-provider.tsx';

export class ToolState {
  constructor(
    public readonly colour: string,
    public readonly lineWidth: number,
  ) {
  }

  public static fromState(state: GlobalContextState): ToolState {
    const [red, green, blue] = state.color;

    return new ToolState(
      `rgb(${red},${green},${blue})`,
      state.lineWidth
      );
  }
}
