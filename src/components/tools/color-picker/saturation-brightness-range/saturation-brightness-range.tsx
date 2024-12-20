import { CONFIG } from '../config.ts';
import styles from '../color-picker/color-picker.module.css';
import { Point } from '../../../../types/Point.ts';
import { type Accessor, createEffect, onMount, type VoidProps } from 'solid-js';
import { FULL_CIRCLE } from '../../../../constants.ts';
import { Color } from '../../../../types/Color.ts';

export const SaturationBrightnessRange = (props: VoidProps<{
  hue: Accessor<number>;
  onChange: (rgb: Color) => void}>) => {
  let pickerRef!: HTMLCanvasElement;
  let pickerCtx: CanvasRenderingContext2D;

  const drawPicker = (ctx: CanvasRenderingContext2D, hue = 0) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const saturation = x / width;
        const brightness = 1 - y / height;

        const { red, green, blue } = Color.fromHsl(hue, saturation, brightness);
        const index = (y * width + x) * 4;
        imageData.data[index] = red;
        imageData.data[index + 1] = green;
        imageData.data[index + 2] = blue;
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
    drawPicker(pickerCtx, props.hue());
    drawSelectorAt(pickerCtx, point);
    const { red, green, blue } = pickerCtx.getColorFromPixel(point.x, point.y);
    props.onChange(new Color(red, green, blue));
  }

  const handlePickerMove = (event: MouseEvent) => event.buttons == 1 && handleColorChange(event);

  onMount(() => {
    pickerCtx = pickerRef.getContext('2d', { willReadFrequently: true })!;
    drawPicker(pickerCtx);
  });

  createEffect(() => drawPicker(pickerCtx, props.hue()));

  return <canvas
    class={styles.color}
    ref={pickerRef!}
    width={CONFIG.width}
    height={CONFIG.pickerHeight}
    onClick={handleColorChange}
    onMouseMove={handlePickerMove}>
  </canvas>;
}
