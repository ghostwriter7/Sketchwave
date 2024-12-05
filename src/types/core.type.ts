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

export type ShapeType = SimpleShapeType | ComplexShapeType;

export type SimpleShapeType = | 'arrow'
  | 'bolt'
  | 'checkmark'
  | 'diamond'
  | 'rect'
  | 'star'
  | 'triangle';

export type ComplexShapeType =
  | 'circle'
  | 'halfMoon'
  | 'heart'
  | 'notifications'
  | 'person';


export type CreatePointsForShapeFn = (origin: Point, endPoint: Point, dx: number, dy: number) => Point[];
export type CreatePathForShapeFn = (origin: Point, endPoint: Point, dx: number, dy: number) => Path2D;

export type Constructor = new (...args: any) => any;
