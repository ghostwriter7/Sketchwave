import { createEffect, type VoidProps } from 'solid-js';
import { type Gradient, type GradientType } from './gradient-generator.tsx';
import styles from './gradient-generator.module.css';

export const GradientPreview = (props: VoidProps<{
  height?: number;
  gradient: Gradient;
  width?: number;
}>) => {
  const canvas = <canvas
    class={styles.gradientPreview}
    width={props.width || 500}
    height={props.height || 300}></canvas> as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  const createGradientFromType = (type: GradientType) => {
    switch (type) {
      case 'linear':
        return ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
      case 'radial': {
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const outerRadius = Math.min(ctx.canvas.width, ctx.canvas.height) / 2;
        return ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, outerRadius);
      }
      case 'conic':
        return ctx.createConicGradient(0, ctx.canvas.width / 2, ctx.canvas.height / 2);
    }
  }

  createEffect(() => {
    const gradient = props.gradient;

    const canvasGradient = createGradientFromType(gradient.gradientType)!;

    gradient.gradientDefinitions.forEach(({ color, stop }) =>
      canvasGradient.addColorStop(stop, color.toString()));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = canvasGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  return canvas;
}
