import { Point } from './Point.ts';

export interface Layer {
  order?: number;
  tool: string;

  draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
}

export type ToolType =
  | 'airbrush'
  | 'beadsBrush'
  | 'brush'
  | 'calligraphyBrush'
  | 'eraser'
  | 'fillSpace'
  | 'pastelBrush'
  | 'marker'
  | 'importImage'
  | 'line'
  | 'shape'
  | 'wiggleLineBrush';

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

export type RGBA = [number, number, number, number];
export type RGB = [number, number, number];

export type OptionValue = string | number;

export type Option<T = OptionValue> = {
  label: string;
  value: T;
  icon?: string;
}

export type Options<T = OptionValue> = Option<T>[];
