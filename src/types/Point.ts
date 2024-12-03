export class Point {
  constructor(public readonly x: number,
              public readonly y: number) {
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
}
