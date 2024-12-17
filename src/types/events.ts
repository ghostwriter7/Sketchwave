import type { Color } from './Color.ts';

/*
 * Event dispatched upon scaling the main canvas
 */
export class ScaleChangeEvent extends CustomEvent<{ scale: number}> {
  public static NAME = 'scalechange' as const;

  constructor(scale: number) {
    super(ScaleChangeEvent.NAME, { detail: { scale }});
  }
}

export class ColorPickEvent extends CustomEvent<{ color: Color}> {
  public static NAME = 'colorpick' as const;

  constructor(color: Color) {
    super(ColorPickEvent.NAME, { detail: { color }});
  }
}
