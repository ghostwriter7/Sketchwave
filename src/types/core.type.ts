import { Point } from './Point.ts';

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
  | 'line'
  | 'shape';

export type ShapeType =
  'rect'
| 'star'
| 'triangle'

export type CreatePointsForShapeFn = (origin: Point, endPoint: Point) => Point[];

export type Constructor = new (...args: any) => any;
