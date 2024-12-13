import './resizer.css';
import { createEffect, onMount } from 'solid-js';
import { Point } from '../../types/Point.ts';
import { calculateDistance } from '../../math/distance.ts';
import { useGlobalContext } from '../../global-provider.tsx';
import { ThemeHelper } from '../../utils/ThemeHelper.ts';
import { RESIZE_CURSORS } from '../../types/cursors.ts';

export const Resizer = () => {
  const { state, setDimensions } = useGlobalContext();

  const canvasRef = <canvas class="resizer" width={innerWidth} height={innerHeight}/> as HTMLCanvasElement;
  const ctx = canvasRef.getContext('2d')!;

  let indicators: Point[];

  const cursors = RESIZE_CURSORS;

  const cursorCapabilities = {
    'nw-resize': { moveXAxis: true, moveYAxis: true, changeOriginX: true, changeOriginY: true },
    'n-resize': { moveXAxis: false, moveYAxis: true, changeOriginX: false, changeOriginY: true },
    'ne-resize': { moveXAxis: true, moveYAxis: true, changeOriginX: false, changeOriginY: true },
    'w-resize': { moveXAxis: true, moveYAxis: false, changeOriginX: true, changeOriginY: false },
    'e-resize': { moveXAxis: true, moveYAxis: false, changeOriginX: false, changeOriginY: false },
    'sw-resize': { moveXAxis: true, moveYAxis: true, changeOriginX: true, changeOriginY: false },
    's-resize': { moveXAxis: false, moveYAxis: true, changeOriginX: false, changeOriginY: false },
    'se-resize': { moveXAxis: true, moveYAxis: true, changeOriginX: false, changeOriginY: false },
  } as const;

  const updateCursorIfApplicable = (event: MouseEvent): void => {
    const point = Point.fromEvent(event);
    cursorIndex = indicators.findIndex((indicatorPoint) => calculateDistance(point, indicatorPoint) < 10);
    canvasRef.style.cursor = cursorIndex !== -1 ? cursors[cursorIndex] : 'default';
    canvasRef.style.zIndex = 'unset';
  }

  const getActualCanvasDimensions = (): { width: number, height: number } => {
    const { width, height } = document.querySelector('.canvas')!.getBoundingClientRect();
    return { width, height };
  }

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

  const getOriginXAndY = () => {
    const { width, height } = getActualCanvasDimensions();
    return {
      originX: canvasRef.width / 2 - width / 2,
      originY: canvasRef.height / 2 - height / 2
    };
  }

  createEffect(() => {
    state.scale; state.width; state.height;
    const { width, height } = getActualCanvasDimensions();
    const { originX, originY } = getOriginXAndY();

    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    renderIndicators(originX, originY, width, height);
  });


  const drawSizePreview = (x: number, y: number, width: number, height: number) => {
    renderIndicators(x, y, width, height);
    ctx.setLineDash([4, 2]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = ThemeHelper.getColor('clr-primary');
    ctx.strokeRect(x, y, width, height);
  }

  let isDragging = false;
  let cursorIndex = -1;
  let newWidth: number, newHeight: number;

  const calculateDelta = (isMovable: boolean, canChangeOrigin: boolean, currentOrigin: number, eventOrigin: number): number => {
    if (!isMovable) return 0;
    return canChangeOrigin ? currentOrigin - eventOrigin : eventOrigin - currentOrigin;
  }

  const adjustBounds = (origin: number, size: number, newOrigin: number, newSize: number): {
    adjustedOrigin: number,
    adjustedSize: number
  } => {
    if ((origin + size) - newOrigin <= 1) {
      return { adjustedOrigin: origin + size + 1, adjustedSize: 2 };
    } else if (newOrigin == origin && newSize < 0) {
      return { adjustedOrigin: origin + 1, adjustedSize: 2 };
    }
    return { adjustedOrigin: newOrigin, adjustedSize: newSize };
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
      canvasRef.style.zIndex = '2';

      const { offsetY, offsetX } = event;
      const { height, width } = getActualCanvasDimensions();

      const { originX: currentOriginX, originY: currentOriginY } = getOriginXAndY();

      const cursorName = cursors[cursorIndex];
      const { changeOriginX, changeOriginY, moveXAxis, moveYAxis } = cursorCapabilities[cursorName];

      const deltaY = calculateDelta(moveYAxis, changeOriginY, currentOriginY, offsetY);
      const deltaX = calculateDelta(moveXAxis, changeOriginX, currentOriginX, offsetX);

      let newOriginX = changeOriginX ? currentOriginX - deltaX : currentOriginX;
      let newOriginY = changeOriginY ? currentOriginY - deltaY : currentOriginY;

      newWidth = changeOriginX ? width + deltaX : moveXAxis ? deltaX : width;
      newHeight = changeOriginY ? height + deltaY : moveYAxis ? deltaY : height;

      ({
        adjustedOrigin: newOriginX,
        adjustedSize: newWidth
      } = adjustBounds(currentOriginX, width, newOriginX, newWidth));
      ({
        adjustedOrigin: newOriginY,
        adjustedSize: newHeight
      } = adjustBounds(currentOriginY, height, newOriginY, newHeight));

      drawSizePreview(newOriginX, newOriginY, newWidth, newHeight);
    } else {
      updateCursorIfApplicable(event);
    }
  }


  const handleMouseDown = () => {
    isDragging = canvasRef.style.cursor !== 'default';
  }

  const handleMouseUp = () => {
    if (!isDragging) return;

    const { width, height } = getActualCanvasDimensions();
    if (newWidth !== width || newHeight !== height) {
      setDimensions(newWidth / state.scale, newHeight / state.scale);
    }
    isDragging = false;
    canvasRef.style.zIndex = 'unset';
  }

  onMount(() => {
    canvasRef.addEventListener('mousemove', handleMouseMove);
    canvasRef.addEventListener('mouseup', handleMouseUp);
    canvasRef.addEventListener('mousedown', handleMouseDown);
  });

  return canvasRef;
}
