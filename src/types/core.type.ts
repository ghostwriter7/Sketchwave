import { Point } from './Point.ts';

export interface Layer {
  originX?: number;
  originY?: number;
  canvasWidth: number;
  canvasHeight: number;
  order?: number;
  tool: string;

  draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
}

export type RotateAction = 'rotateCCW' | 'rotateCW' | 'flipHorizontal' | 'flipVertical';
export type BrushType =
  | 'airbrush'
  | 'beadsBrush'
  | 'brush'
  | 'calligraphyBrush'
  | 'pastelBrush'
  | 'marker'
  | 'wiggleLineBrush';

export type ToolType =
  | 'eraser'
  | 'fillSpace'
  | 'importImage'
  | 'line'
  | 'select'
  | 'shape'
  | BrushType
  | RotateAction;

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

export type Coordinate = { x: number, y: number };
