export class Point {
  constructor(public readonly x: number,
              public readonly y: number) {
  }

  public static delta(startPoint: Point, endPoint: Point): { dx: number; dy: number; } {
    return { dx: endPoint.x - startPoint.x, dy: endPoint.y - startPoint.y };
  }

  public static fromEvent(event: MouseEvent): Point {
    return new Point(event.offsetX, event.offsetY);
  }

  public static verticalMidPoint(pointA: Point, pointB: Point): Point {
    return new Point(pointA.x, (pointB.y - pointA.y) / 2 + pointA.y);
  }

  public static horizontalMidPoint(pointA: Point, pointB: Point): Point {
    return new Point((pointB.x - pointA.x) / 2 + pointA.x, pointA.y);
  }

  public static isWithinBoundingBox(point: Point, boxOrigin: Point, width: number, height: number): boolean {
    return point.x >= boxOrigin.x && point.x <= boxOrigin.x + width
      && point.y >= boxOrigin.y && point.y <= boxOrigin.y + height;
  }
}
