export type Coordinates = [number, number];

export type Dimensions = [number, number];

export interface Layer {
  id?: string;
  order?: number;
  tool: string;

  draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
}

export type ToolType =
  'airbrush'
  | 'brush'
  | 'calligraphyBrush'
  | 'eraser'
  | 'pastelBrush'
  | 'marker'
  | 'rect'
  | 'line';

export type Constructor = new (...args: any) => any;
