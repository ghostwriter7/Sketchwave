export class Point {
  constructor(public readonly x: number,
              public readonly y: number) {
  }

  public static fromEvent(event: MouseEvent): Point {
    return new Point(event.offsetX, event.offsetY);
  }
}
