import { CONFIG } from '../config.ts';
import { Point } from '../../../../types/Point.ts';
import { getRGBFromPixel } from '../../../../color/get-rgb-from-pixel.ts';
import { colorState } from '../color-store.ts';
import { createEffect, onMount } from 'solid-js';
import { hsbToRgb } from '../../../../color/hsb-to-rgb.ts';
import { FULL_CIRCLE } from '../../../../constants.ts';
import { useGlobalContext } from '../../../../global-provider.tsx';

export const SaturationBrightnessRange = () => {
  const { updateState } = useGlobalContext();

  let pickerRef: HTMLCanvasElement;
  let pickerCtx: CanvasRenderingContext2D;

  const drawPicker = (ctx: CanvasRenderingContext2D, hue = 0) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const saturation = x / width;
        const brightness = 1 - y / height;

        const [r, g, b] = hsbToRgb(hue, saturation, brightness);
        const index = (y * width + x) * 4;
        imageData.data[index] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  const drawSelectorAt = (ctx: CanvasRenderingContext2D, { x, y }: Point) => {
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.arc(x, y, 8, 0, FULL_CIRCLE);
    ctx.stroke();
    ctx.closePath();
  }

  const handleColorChange = (event: MouseEvent) => {
    const point = Point.fromEvent(event);
    pickerCtx.clearRect(0, 0, pickerCtx.canvas.width, pickerCtx.canvas.height);
    drawPicker(pickerCtx, colorState.hue);
    drawSelectorAt(pickerCtx, point);
    updateState({ color: getRGBFromPixel(pickerCtx, point) });
  }

  const handlePickerMove = (event: MouseEvent) => event.buttons == 1 && handleColorChange(event);

  onMount(() => {
    pickerCtx = pickerRef.getContext('2d', { willReadFrequently: true })!;
    drawPicker(pickerCtx);
  });

  createEffect(() => {
    drawPicker(pickerCtx, colorState.hue);
  });

  return <canvas
    class="color"
    ref={pickerRef!}
    width={CONFIG.width}
    height={CONFIG.pickerHeight}
    onClick={handleColorChange}
    onMouseMove={handlePickerMove}>
  </canvas>;
}
