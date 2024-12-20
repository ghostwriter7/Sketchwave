/// <reference types="vite/client" />

import type { Color } from './types/Color.ts';
import type { Point } from './types/Point.ts';

type Type = {
  description?: string,
  accept: {
    [key: string]: string[],
  },
}

declare global {

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }

  interface HTMLElementEventMap {
    scalechange: CustomEvent<{ scale: number }>;
  }

  interface Array {
    chunk<T>(size: number): T[][];
  }

  interface Window {
    ctx: CanvasRenderingContext2D;
    showOpenFilePicker(options: {
      excludeAcceptAllOption?: boolean,
      multiple?: boolean,
      startIn?: string,
      types: Type[]
    }): Promise<FileSystemFileHandle[]>;

    showSaveFilePicker(options: { suggestedName: string; types: Type[] }): Promise<FileSystemFileHandle>;
  }

  interface String {
    toTitleCase(): string;
  }

  interface CanvasRenderingContext2D {
    getColorFromPixel(x: number, y: number): Color;
    rotateCanvas(origin: Point, radians: number): void;
  }

  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }
}
