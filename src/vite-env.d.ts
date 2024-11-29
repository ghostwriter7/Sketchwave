/// <reference types="vite/client" />

type Type = {
  description?: string,
  accept: {
    [key: string]: string[],
  },
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
