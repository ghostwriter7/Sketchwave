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

  const updateOriginXCursors = ['nw-resize', 'w-resize', 'sw-resize'];
  const shouldChangeOriginX = (cursor: string) => updateOriginXCursors.includes(cursor);

  const updateOriginYCursors = ['nw-resize', 'n-resize', 'ne-resize']
  const shouldChangeOriginY = (cursor: string) => updateOriginYCursors.includes(cursor);

  const canMoveInXY = (cursor: string): boolean => cursor.split('-')[0].length == 2;

  const canMoveInY = (cursor: string): boolean =>
    canMoveInXY(cursor) || cursor.startsWith('s') || cursor.startsWith('n');

  const canMoveInX = (cursor: string): boolean =>
    canMoveInXY(cursor) || cursor.startsWith('e') || cursor.startsWith('w');

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

  createEffect(() => {
    const width = state.width;
    const height = state.height;

    const originX = (canvasRef.width / 2) - (width / 2);
    const originY = (canvasRef.height / 2) - (height / 2);

    renderIndicators(originX, originY, width, height);
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

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
      canvasRef.style.zIndex = '2';
      const { offsetY, offsetX } = event;
      const width = state.width;
      const height = state.height;

      const originX = (canvasRef.width / 2) - (width / 2);
      const originY = (canvasRef.height / 2) - (height / 2);

      const cursorName = cursors[cursorIndex];

      const xAxisMovable = canMoveInX(cursorName);
      const yAxisMovable = canMoveInY(cursorName);
      const changeOriginX = shouldChangeOriginX(cursorName);
      const changeOriginY = shouldChangeOriginY(cursorName);

      const deltaY = yAxisMovable ?
        (changeOriginY ? originY - offsetY : offsetY - originY) : 0;
      const deltaX = xAxisMovable ?
        (changeOriginX ? originX - offsetX : offsetX - originX) : 0;

      let newOriginX = changeOriginX ? originX - deltaX : originX;
      let newOriginY = changeOriginY ? originY - deltaY : originY;

      let newWidth = changeOriginX ? width + deltaX : xAxisMovable ? deltaX : width;
      let newHeight = changeOriginY ? height + deltaY : yAxisMovable ? deltaY : height;

      if ((originX + width) - newOriginX  <= 1) {
        newOriginX = originX + width - 1;
        newWidth = 2;
      } else if (newOriginX == originX && newWidth < 0) {
        newOriginX = originX + 1;
        newWidth = 2;
      }

      if ((originY + height) - newOriginY <= 1) {
        newOriginY = originY + height - 1;
        newHeight = 2;
      } else if (newOriginY == originY && newHeight < 0) {
        newOriginY = originY + 1;
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

  const handleMouseUp = ()=> {
    isDragging = false;
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
