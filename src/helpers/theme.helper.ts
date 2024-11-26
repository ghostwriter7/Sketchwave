export class ThemeHelper {
  private static cache: Record<string, string> = {};

  public static getColor(key: string): string {
    if (!key.startsWith('--')) key = `--${key}`;

    if (this.cache[key]) {
      return this.cache[key];
    }

    const value = getComputedStyle(document.documentElement).getPropertyValue(key);
    this.cache[key] = value;
    return value;
  }
}
