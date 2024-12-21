/*
 * Event dispatched upon scaling the main canvas
 */
export class ScaleChangeEvent extends CustomEvent<{ scale: number}> {
  public static NAME = 'scalechange' as const;

  constructor(scale: number) {
    super(ScaleChangeEvent.NAME, { detail: { scale }});
  }
}

