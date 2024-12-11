import type { RGBA } from '../types/core.type.ts';

export const stringifyRgb = (rgb: RGBA): string =>
  `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${rgb[3]})`;
