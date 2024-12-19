import { createEffect, type VoidProps } from 'solid-js';
import { type GradientType, useGradientContext } from './gradient-generator.tsx';

export const GradientPreview = (props: VoidProps<{ height?: number; width?: number }>) => {
  const { state } = useGradientContext();

  const canvas = <canvas
    width={props.width || 500}
    height={props.height || 300}></canvas> as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  const createGradientFromType = (type: GradientType) => {
    switch (type) {
      case 'linear':
        return ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
      case 'radial':
        return null // todo;
      case 'conic':
        return ctx.createConicGradient(0, ctx.canvas.width / 2, ctx.canvas.height / 2);
    }
  }

  createEffect(() => {
    const gradientDefinitions = state.gradientDefinitions;
    const gradientType = state.gradientType;

    const gradient = createGradientFromType(gradientType)!;

    gradientDefinitions.forEach(({ color, stop }) => gradient.addColorStop(stop, color.toString()));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  return canvas;
}
