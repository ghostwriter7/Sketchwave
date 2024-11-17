import { useGlobalContext } from '../../global-provider.tsx';
import './resizer.css';
import { createEffect, onMount } from 'solid-js';
import { Point } from '../../render/primitives/Point.ts';
import { calculateDistance } from '../../math/distance.ts';

export const Resizer = () => {
  const { state, updateState } = useGlobalContext();
  let canvasRef: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let indicators: Point[];

  const cursors = ['nw-resize', 'n-resize', 'ne-resize', 'w-resize', 'e-resize', 'sw-resize', 's-resize', 'se-resize'];

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

    indicators = [
      [leftX, topY], [centerX, topY], [rightX, topY],
      [leftX, centerY], [rightX, centerY],
      [leftX, bottomY], [centerX, bottomY], [rightX, bottomY]
    ].map(([x, y]) => new Point(x, y));

    indicators
      .forEach(({ x, y }) => ctx.fillRect(x, y, squareDimension, squareDimension));
  }

  onMount(() => {
    ctx = canvasRef.getContext('2d')!;
  });

  createEffect(() => {
    const width = state.width;
    const height = state.height;
    renderIndicators(width, height);
  });

  const handleMouseMove = (event: MouseEvent) => {
    const point = Point.fromEvent(event);
    const cursorIndex = indicators.findIndex((indicatorPoint) => calculateDistance(point, indicatorPoint) < 10);
    canvasRef.style.cursor = cursorIndex !== -1 ? cursors[cursorIndex] : 'default';
  }

  return <canvas
    ref={canvasRef!}
    class="resizer"
    width={innerWidth - 100}
    height={innerHeight - 100}
    onMouseMove={handleMouseMove}>
  </canvas>
}
