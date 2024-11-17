import { useGlobalContext } from '../../global-provider.tsx';
import './resizer.css';
import { createEffect, onMount } from 'solid-js';

export const Resizer = () => {
  const { state, updateState } = useGlobalContext();
  let canvasRef: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  const renderIndicators = (innerCanvasWidth: number, innerCanvasHeight: number) => {
    const { height, width } = canvasRef;
    const squareDimension = 5;

    const originX = (width / 2) - (innerCanvasWidth / 2);
    const originY = (height / 2) - (innerCanvasHeight / 2);

    ctx.fillStyle = '#fff';

    const leftX = originX - squareDimension;
    const centerX = originX + innerCanvasWidth / 2;
    const rightX = originX + innerCanvasWidth;

    const topY = originY - squareDimension;
    const centerY = originY + innerCanvasHeight / 2 - squareDimension / 2;
    const bottomY = originY + innerCanvasHeight;

    [
      [leftX, topY], [centerX, topY], [rightX, topY],
      [leftX, centerY], [rightX, centerY],
      [leftX, bottomY], [centerX, bottomY], [rightX, bottomY]
    ].forEach(([x, y]) => ctx.fillRect(x, y, squareDimension, squareDimension));
  }

  onMount(() => {
    ctx = canvasRef.getContext('2d')!;
  });

  createEffect(() => {
    const width = state.width;
    const height = state.height;
    renderIndicators(width, height);
  });

  return <canvas ref={canvasRef!} class="resizer" width={innerWidth - 100} height={innerHeight - 100  }></canvas>
}
