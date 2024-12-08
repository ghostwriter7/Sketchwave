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

  public ccwPerp(): Vec2 {
    return new Vec2(this.y, -this.x);
  }

  public cwPerp(): Vec2 {
    return new Vec2(-this.y, this.x);
  }

  public scale(scale: number): Vec2 {
    return new Vec2(this.x * scale, this.y * scale);
  }
}
