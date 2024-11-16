import { createEffect, onMount } from 'solid-js';
import { useGlobalContext } from '../../global-provider.tsx';
import { stringifyRgb } from '../../color/stringify-rgb.ts';
import { Card } from '../../ui/card/card.tsx';

type ExtendedPath2D = Path2D & { lineWidth: number };

export const LineThicknessPicker = () => {
  const { state } = useGlobalContext();
  let canvasRef: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  const lineMap = new Map<ExtendedPath2D, { startX: number, endX: number }>();

  const renderLines = () => {
    const gap = 10;
    const thicknesses = [1, 2, 3, 5, 7, 9, 11, 14, 17, 21];
    canvasRef.width = thicknesses.reduce((a, b) => a + b, 0) + thicknesses.length * gap;
    let currentX = gap;
    const rgb = stringifyRgb(state.color);
    ctx.strokeStyle = rgb;

    for (let i = 0; i < thicknesses.length; i++) {
      const thickness = thicknesses[i];
      const path = new Path2D() as ExtendedPath2D;
      lineMap.set(path, { startX: currentX, endX: currentX + thickness });
      ctx.beginPath();
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      path.moveTo(currentX + thickness / 2, 5 + thickness / 2);
      path.lineTo(currentX + thickness / 2, 100 - 5 - thickness / 2);
      path.lineWidth = thickness;
      ctx.stroke(path);
      currentX += gap + thickness;
    }
  }

  onMount(() => {
    ctx = canvasRef.getContext('2d')!;
    renderLines();
  });

  createEffect(() => {
    state.color;
    renderLines();
  })

  const highlightSelectedLine = (path: ExtendedPath2D) => {
    ctx.strokeStyle = stringifyRgb(state.color);
    lineMap.forEach((_, path) => {
      ctx.lineWidth = path.lineWidth;
      ctx.stroke(path);
    });
    ctx.lineWidth = path.lineWidth;
    ctx.strokeStyle = 'red';
    ctx.stroke(path);
  }

  const handleClick = (event: MouseEvent): void => {
    const { offsetX } = event;

    const calcLineDistanceFromClick = (startX: number, endX: number) =>
      Math.min(Math.abs(offsetX - startX), Math.abs(offsetX - endX));

    const activeLine = [...lineMap.entries()]
      .reduce((currentThickness, [thickness, { startX, endX }]) => {
        if (!currentThickness) {
          return [thickness, calcLineDistanceFromClick(startX, endX)];
        }

        const distance = calcLineDistanceFromClick(startX, endX)
        return distance < currentThickness[1] ? [thickness, distance] : currentThickness;
      }, null)[0];

    highlightSelectedLine(activeLine);
  }


  return <>
    <button popovertarget="line-thickness">
      <span class="material-symbols-outlined">format_line_spacing</span>
    </button>

    <Card title="Line thickness" id="line-thickness" popover="auto">
      <canvas ref={canvasRef} height="100" onClick={handleClick}></canvas>
    </Card>
  </>

}
