export class Vec2 {
  constructor(public x: number, public y: number) {
  }

  public computeMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public normalize(): Vec2 {
    const magnitude = this.computeMagnitude();
    return new Vec2(this.x / magnitude, this.y / magnitude);
  }
}
