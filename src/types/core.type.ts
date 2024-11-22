export type Coordinates = [number, number];

export type Dimensions = [number, number];

export interface Layer {
  id?: string;
  tool: string
  draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
}

export type ToolType = 'eraser' | 'rect' | 'line';

export type Constructor = new (...args: any) => any;
