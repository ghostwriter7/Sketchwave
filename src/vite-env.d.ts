/// <reference types="vite/client" />

interface Window {
  showOpenFilePicker(options:  {excludeAcceptAllOption?: boolean,
  multiple?: boolean,
  startIn?: string ,
  types: {
    description?: string,
    accept: {
      [key: string]: string[],
    },
  }[]}): Promise<FileSystemFileHandle[]>;
}

interface String {
  toTitleCase(): string;
}
