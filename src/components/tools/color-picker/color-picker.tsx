import './color-picker.css';
import { createEffect, onMount } from 'solid-js';
import { hsbToRgb } from '../../../color/hsb-to-rgb.ts';
import { getRGBFromPixel } from '../../../color/get-rgb-from-pixel.ts';
import { useGlobalContext } from '../../../global-provider.tsx';
import { rgbToHex } from '../../../color/rgb-to-hex.ts';
import { Card } from '../../card/card.tsx';
import { Point } from '../../../types/Point.ts';
import { HueRange } from './hue-range/hue-range.tsx';
import { CONFIG } from './config.ts';
import { colorState } from './color-store.ts';

const FULL_CIRCLE = 2 * Math.PI;

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

export const ColorPicker = () => {
  const { state, updateState } = useGlobalContext();

  let previewRef: HTMLDivElement;
  let triggerRef: HTMLInputElement;

  let pickerRef: HTMLCanvasElement;
  let pickerCtx: CanvasRenderingContext2D;

  onMount(() => {
    pickerCtx = pickerRef.getContext('2d', { willReadFrequently: true })!;
    drawPicker(pickerCtx)
  });

  createEffect(() => {
    drawPicker(pickerCtx, colorState.hue);
  });

  createEffect(() => {
    const [red, green, blue] = state.color;
    previewRef.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    triggerRef.value = rgbToHex(red, green, blue);
  });

  const handleColorChange = (event: MouseEvent) => {
    const point = Point.fromEvent(event);
    pickerCtx.clearRect(0, 0, pickerCtx.canvas.width, pickerCtx.canvas.height);
    drawPicker(pickerCtx, colorState.hue);
    drawSelectorAt(pickerCtx, point);
    updateState({ color: getRGBFromPixel(pickerCtx, point) });
  }

  const handlePickerMove = (event: MouseEvent) => {
    if (event.buttons !== 1) return;
    const point = Point.fromEvent(event);
    handleColorChange(event);
    const [red, green, blue] = getRGBFromPixel(pickerCtx, point);
    previewRef.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
  }

  let popoverRef: HTMLDivElement;

  const toggleColorPicker = (event: MouseEvent) => {
    event.preventDefault();
    popoverRef.showPopover();
  }

  return <>
    <input tabindex="0" id="color-picker-button" class="button interactive" ref={triggerRef!} type="color"
           onClick={toggleColorPicker} title="Color (C)"/>
    <Card ref={popoverRef!} title="Color picker" id="color-picker" popover="auto">
      <div class="color-picker">
        <div class="preview" ref={previewRef!}></div>
        <canvas
          class="color"
          ref={pickerRef!}
          width={CONFIG.width}
          height={CONFIG.pickerHeight}
          onClick={handleColorChange}
          onMouseMove={handlePickerMove}
        >
        </canvas>

        <HueRange />
      </div>
    </Card>
  </>
}
