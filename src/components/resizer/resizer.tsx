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

  const cursors = ['nw-resize', 'n-resize', 'ne-resize', 'w-resize', 'e-resize', 'sw-resize', 's-resize', 'se-resize'] as const;

  const cursorCapabilities = {
    'nw-resize': { moveX: true, moveY: true, changeOriginX: true, changeOriginY: true },
    'n-resize': { moveX: false, moveY: true, changeOriginX: false, changeOriginY: true },
    'ne-resize': { moveX: true, moveY: true, changeOriginX: false, changeOriginY: true },
    'w-resize': { moveX: true, moveY: false, changeOriginX: true, changeOriginY: false },
    'e-resize': { moveX: true, moveY: false, changeOriginX: false, changeOriginY: false },
    'sw-resize': { moveX: true, moveY: true, changeOriginX: true, changeOriginY: false },
    's-resize': { moveX: false, moveY: true, changeOriginX: false, changeOriginY: false },
    'se-resize': { moveX: true, moveY: true, changeOriginX: false, changeOriginY: false },
  } as const;

  const renderIndicators = (x: number, y: number, width: number, height: number) => {
    const squareDimension = 5;

    ctx.fillStyle = '#fff';

    const leftX = x - squareDimension;
    const centerX = x + width / 2;
    const rightX = x + width;

    const topY = y - squareDimension;
    const centerY = y + height / 2 - squareDimension / 2;
    const bottomY = y + height;

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

  const getOriginXAndY = () => ({
    originX: canvasRef.width / 2 - state.width / 2,
    originY: canvasRef.height / 2 - state.height / 2
  })

  createEffect(() => {
    const { originX, originY } = getOriginXAndY();
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    renderIndicators(originX, originY, state.width, state.height);
  });


  const drawSizePreview = (x: number, y: number, width: number, height: number) => {
    renderIndicators(x, y, width, height);
    ctx.setLineDash([4, 2]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.strokeRect(x, y, width, height);
  }

  let isDragging = false;
  let cursorIndex = -1;
  let newWidth: number, newHeight: number;

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
      canvasRef.style.zIndex = '2';
      const { offsetY, offsetX } = event;
      const width = state.width;
      const height = state.height;

      const { originX: currentOriginX, originY: currentOriginY } = getOriginXAndY();

      const cursorName = cursors[cursorIndex];
      const { changeOriginX, changeOriginY, moveX, moveY } = cursorCapabilities[cursorName];

      const deltaY = moveY ?
        (changeOriginY ? currentOriginY - offsetY : offsetY - currentOriginY) : 0;
      const deltaX = moveX ?
        (changeOriginX ? currentOriginX - offsetX : offsetX - currentOriginX) : 0;

      let newOriginX = changeOriginX ? currentOriginX - deltaX : currentOriginX;
      let newOriginY = changeOriginY ? currentOriginY - deltaY : currentOriginY;

      newWidth = changeOriginX ? width + deltaX : moveX ? deltaX : width;
      newHeight = changeOriginY ? height + deltaY : moveY ? deltaY : height;

      if ((currentOriginX + width) - newOriginX <= 1) {
        newOriginX = currentOriginX + width - 1;
        newWidth = 2;
      } else if (newOriginX == currentOriginX && newWidth < 0) {
        newOriginX = currentOriginX + 1;
        newWidth = 2;
      }

      if ((currentOriginY + height) - newOriginY <= 1) {
        newOriginY = currentOriginY + height - 1;
        newHeight = 2;
      } else if (newOriginY == currentOriginY && newHeight < 0) {
        newOriginY = currentOriginY + 1;
        newHeight = 2;
      }

      drawSizePreview(newOriginX, newOriginY, newWidth, newHeight);
    } else {
      const point = Point.fromEvent(event);
      cursorIndex = indicators.findIndex((indicatorPoint) => calculateDistance(point, indicatorPoint) < 10);
      canvasRef.style.cursor = cursorIndex !== -1 ? cursors[cursorIndex] : 'default';
      canvasRef.style.zIndex = 'unset';
    }
  }


  const handleMouseDown = () => {
    isDragging = canvasRef.style.cursor !== 'default';
  }

  const handleMouseUp = () => {
    isDragging = false;
    canvasRef.style.zIndex = 'unset';
    if (newWidth !== state.width || newHeight !== state.height) {
      updateState({ width: newWidth, height: newHeight });
    }
  }

  return <canvas
    ref={canvasRef!}
    class="resizer"
    width={innerWidth - 100}
    height={innerHeight - 100}
    onMouseMove={handleMouseMove}
    onMouseDown={handleMouseDown}
    onMouseUp={handleMouseUp}
  >
  </canvas>
}
