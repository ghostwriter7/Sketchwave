import type { Coordinate } from './core.type.ts';

export class Point implements Iterable<number>, Coordinate{
  constructor(public readonly x: number,
              public readonly y: number) {
  }

  public *[Symbol.iterator](): Generator<number> {
    yield this.x;
    yield this.y;
  }

  public toArray(): [number, number] {
    return [this.x, this.y];
  }

  public static delta(startPoint: Point, endPoint: Point): { dx: number; dy: number; } {
    return { dx: endPoint.x - startPoint.x, dy: endPoint.y - startPoint.y };
  }

  public static fromEvent(event: MouseEvent): Point {
    return new Point(event.offsetX, event.offsetY);
  }

  public static verticalMidPoint(pointA: Point, pointB: Point): Point {
    return new Point(pointA.x, (pointB.y + pointA.y) / 2);
  }

  public static horizontalMidPoint(pointA: Point, pointB: Point): Point {
    return new Point((pointB.x + pointA.x) / 2, pointA.y);
  }

  public static midPoint(pointA: Point, pointB: Point): Point {
    return new Point((pointA.x + pointB.x) / 2, (pointA.y + pointB.y) / 2);
  }

  public static isWithinBoundingBox(point: Coordinate, boxOrigin: Coordinate, width: number, height: number): boolean {
    return point.x >= boxOrigin.x && point.x <= boxOrigin.x + width
      && point.y >= boxOrigin.y && point.y <= boxOrigin.y + height;
  }
}
