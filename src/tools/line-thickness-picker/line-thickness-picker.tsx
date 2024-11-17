import { createEffect, onMount } from 'solid-js';
import { useGlobalContext } from '../../global-provider.tsx';
import { stringifyRgb } from '../../color/stringify-rgb.ts';
import { Card } from '../../ui/card/card.tsx';

type ExtendedPath2D = Path2D & { lineWidth: number, startX: number, endX: number };

export const LineThicknessPicker = () => {
  const { state, updateState } = useGlobalContext();

  let canvasRef: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  const lineMap = new Map<number, ExtendedPath2D>();

  const renderLines = () => {
    const gap = 10;
    const thicknesses = [1, 2, 3, 5, 7, 9, 11, 14, 17, 21];
    canvasRef.width = thicknesses.reduce((a, b) => a + b, 0) + thicknesses.length * gap;
    let currentX = gap;
    const rgb = stringifyRgb(state.color);
    ctx.strokeStyle = rgb;
    ctx.font = '15px Poiret One';

    for (let i = 0; i < thicknesses.length; i++) {
      const thickness = thicknesses[i];
      const path = new Path2D() as ExtendedPath2D;
      path.startX = currentX;
      path.endX = currentX + thickness;
      path.lineWidth = thickness;

      const centerX = currentX + thickness / 2;
      path.moveTo(centerX, 5 + thickness / 2);
      path.lineTo(centerX, 100 - 5 - thickness / 2);

      lineMap.set(thickness, path);

      ctx.beginPath();
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';

      ctx.stroke(path);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(thickness.toString(), centerX, 125, thickness + 4);
      currentX += gap + thickness;
    }

    highlightSelectedLine(lineMap.get(state.lineWidth)!)
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
    lineMap.forEach((path) => {
      ctx.lineWidth = path.lineWidth;
      ctx.stroke(path);
    });
    ctx.lineWidth = path.lineWidth;
    ctx.strokeStyle = 'red';
    ctx.stroke(path);
  }

  const handleClick = (event: MouseEvent): void => {
    const { offsetX } = event;

    const calcLineDistanceFromClick = (extendedPath: ExtendedPath2D) =>
      Math.min(Math.abs(offsetX - extendedPath.startX), Math.abs(offsetX - extendedPath.endX));

    const activeLine = [...lineMap.entries()]
      .map(([_, extendedPath]) => [extendedPath, calcLineDistanceFromClick(extendedPath)] as [ExtendedPath2D, number])
      .reduce((previousTuple, currentTuple) =>
        previousTuple[1] < currentTuple[1] ? previousTuple : currentTuple)[0];

    highlightSelectedLine(activeLine);
    updateState({ lineWidth: activeLine.lineWidth })
  }

  return <>
    <button popovertarget="line-thickness">
      <span class="material-symbols-outlined">format_line_spacing</span>
    </button>

    <Card title="Line thickness" id="line-thickness" popover="auto">
      <canvas ref={canvasRef} height="130" onClick={handleClick}></canvas>
    </Card>
  </>

}

