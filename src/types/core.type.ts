export type Coordinates = [number, number];

export type Dimensions = [number, number];

export interface Layer {
  id: string;
  draw(ctx: CanvasRenderingContext2D): void;
}
