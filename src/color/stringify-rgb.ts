export const stringifyRgb = (rgb: [number, number, number], alpha = 1): string =>
  `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
