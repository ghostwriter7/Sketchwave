export class Logger {
  private readonly tag: string;

  private get timestamp(): string {
    return `[${new Date().toLocaleTimeString()}]`;
  }

  constructor(type: new (...args: any) => any) {
    this.tag = `[${type.name.toUpperCase()}]`;
  }

  public log(message: string): void {
    console.log(`${this.tag} ${this.timestamp} -> ${message}`);
  }
}
