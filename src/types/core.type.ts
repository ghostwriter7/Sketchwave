export type Coordinates = [number, number];

export type Dimensions = [number, number];

export interface Layer {
  id?: string;
  tool: string
  draw(ctx: CanvasRenderingContext2D): void;
}

export type ToolType = 'rect' | 'line';

export type Constructor = new (...args: any) => any;
