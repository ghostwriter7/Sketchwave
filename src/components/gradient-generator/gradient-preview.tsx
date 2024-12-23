import { createEffect, type VoidProps } from 'solid-js';
import { type Gradient } from './gradient-generator.tsx';
import styles from './gradient-generator.module.css';
import { Point } from '../../types/Point.ts';

export const GradientPreview = (props: VoidProps<{
  height?: number;
  onClick?: (event: MouseEvent) => void;
  gradient: Gradient;
  width?: number;
}>) => {
  const canvas = <canvas
    class={styles.gradientPreview}
    width={props.width || 500}
    height={props.height || 300}
    onClick={(event) => props.onClick?.(event)}
  >
  </canvas> as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  createEffect(() => {
    const canvasGradient = ctx.createGradient( props.gradient, new Point(0, 0), canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = canvasGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  return canvas;
}
