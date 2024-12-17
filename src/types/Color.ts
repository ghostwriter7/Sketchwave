
export class Color {
  constructor(
    public readonly red: number,
    public readonly green: number,
    public readonly blue: number,
    public readonly alpha = 1
  ) {
  }

  public *[Symbol.iterator]() {
    yield this.red;
    yield this.green;
    yield this.blue;
    yield this.alpha;
  }

  public toString(): string {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
  }

  public toHue(): number {
    const red = this.red / 255;
    const green = this.green / 255;
    const blue = this.blue / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    const delta = max - min;

    let hue = 0;

    if (delta === 0) {
      hue = 0;  // Undefined hue (gray color)
    } else if (max === red) {
      hue = ((green - blue) / delta) % 6;
    } else if (max === green) {
      hue = ((blue - red) / delta) + 2;
    } else {  // Cmax === b
      hue = ((red - green) / delta) + 4;
    }

    // Convert Hue to degrees
    hue = hue * 60;
    if (hue < 0) hue += 360;

    return hue;
  }

  public toHex(): string {
    return '#' + ((1 << 24) + (this.red << 16) + (this.green << 8) + this.blue).toString(16).slice(1).toUpperCase();
  }

  public static fromHsl(h: number, s: number, v: number): Color {
    const c = v * s; // Chroma
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (h >= 300 && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    // Convert to 0-255 range
    const red = Math.round((r + m) * 255);
    const green = Math.round((g + m) * 255);
    const blue = Math.round((b + m) * 255);

    return new Color(red, green, blue);
  }

  public withAlpha(alpha: number): Color {
    return new Color(this.red, this.green, this.blue, alpha);
  }
}
