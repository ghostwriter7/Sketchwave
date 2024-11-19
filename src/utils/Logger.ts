import type { Constructor } from '../types/core.type.ts';

export class Logger {
  private readonly tag: string;

  private readonly debugStyling = this.createStyles('black', 'white');
  private readonly logStyling = this.createStyles('white', 'blue');
  private readonly warnStyling = this.createStyles('white', 'red');

  private get timestamp(): string {
    return `[${new Date().toLocaleTimeString()}]`;
  }

  constructor(type: Constructor | string) {
    this.tag = typeof type === 'string' ? `[${type}]` : `[${type.name}]`;
  }

  public debug(message: string): void {
    console.debug(this.getFormattedMessage(message), this.debugStyling);
  }

  public log(message: string): void {
    console.log(this.getFormattedMessage(message), this.logStyling);
  }

  public warn(message: string): void {
    console.warn(this.getFormattedMessage(message), this.warnStyling);
  }

  private getFormattedMessage(message: string): string {
    return `%c ${this.tag} ${this.timestamp} -> ${message}`
  }

  private createStyles(color: string, backgroundColor: string): string {
    return `color: ${color}; background-color: ${backgroundColor}; font-size: 12px; padding: 2px 4px;`
  }
}
