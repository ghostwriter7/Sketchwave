/// <reference types="vite/client" />

import type { Color } from './types/Color.ts';

type Type = {
  description?: string,
  accept: {
    [key: string]: string[],
  },
}

declare global {
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
  }
}
