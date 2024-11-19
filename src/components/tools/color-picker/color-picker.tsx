import './color-picker.css';
import { createEffect, createSignal, onMount } from 'solid-js';
import { hsbToRgb } from '../../../color/hsb-to-rgb.ts';
import { rgbToHue } from '../../../color/rgb-to-hue.ts';
import { getRGBFromPixel } from '../../../color/get-rgb-from-pixel.ts';
import { useGlobalContext } from '../../../global-provider.tsx';
import { rgbToHex } from '../../../color/rgb-to-hex.ts';
import { Card } from '../../card/card.tsx';

const CONFIG = {
  inlineMargin: 25,
  topEdgeY: 10,
  bottomEdgeY: 20,
  cornerRadius: 5,
  handleRadius: 10,
  handleOutline: 12,
  width: 300,
  pickerHeight: 250,
  sliderHeight: 30,
};

const FULL_CIRCLE = 2 * Math.PI;
const CENTER_Y = CONFIG.sliderHeight / 2;

const drawSlider = (ctx: CanvasRenderingContext2D) => {
  const { bottomEdgeY, cornerRadius, inlineMargin, width, topEdgeY } = CONFIG;

  const gradient = ctx.createLinearGradient(inlineMargin, 0, width - inlineMargin, 0);
  gradient.addColorStop(0, 'red');
  gradient.addColorStop(0.16, 'orange');
  gradient.addColorStop(0.33, 'yellow');
  gradient.addColorStop(0.5, 'green');
  gradient.addColorStop(0.66, 'cyan');
  gradient.addColorStop(0.83, 'blue');
  gradient.addColorStop(1, 'purple');

  ctx.fillStyle = gradient;

  const path = new Path2D();
  path.moveTo(inlineMargin, topEdgeY);

  path.lineTo(width - inlineMargin - cornerRadius, topEdgeY);
  path.arcTo(width - inlineMargin, topEdgeY, width - inlineMargin, topEdgeY + cornerRadius, cornerRadius);

  path.lineTo(width - inlineMargin, bottomEdgeY - cornerRadius);
  path.arcTo(width - inlineMargin, bottomEdgeY, width - inlineMargin - cornerRadius, bottomEdgeY, cornerRadius);

  path.lineTo(inlineMargin + cornerRadius, bottomEdgeY);
  path.arcTo(inlineMargin, bottomEdgeY, inlineMargin, bottomEdgeY - cornerRadius, cornerRadius);

  path.lineTo(inlineMargin, topEdgeY + cornerRadius);
  path.arcTo(inlineMargin, topEdgeY, inlineMargin + cornerRadius, topEdgeY, cornerRadius);

  ctx.fill(path);
}

const drawSliderHandle = (ctx: CanvasRenderingContext2D, x: number, color: string) => {
  const { handleOutline, handleRadius } = CONFIG;
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.arc(x, CENTER_Y, handleOutline, 0, FULL_CIRCLE);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, CENTER_Y, handleRadius, 0, FULL_CIRCLE);
  ctx.fill();
  ctx.closePath();
}

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

const drawSelectorAt = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.beginPath();
  ctx.strokeStyle = 'white';
  ctx.arc(x, y, 8, 0, FULL_CIRCLE);
  ctx.stroke();
  ctx.closePath();
}

export const ColorPicker = () => {
  const { state, updateState } = useGlobalContext();

  const [hue, setHue] = createSignal(0);

  let previewRef: HTMLDivElement;
  let triggerRef: HTMLInputElement;

  let sliderRef: HTMLCanvasElement;
  let sliderCtx: CanvasRenderingContext2D;

  let pickerRef: HTMLCanvasElement;
  let pickerCtx: CanvasRenderingContext2D;

  onMount(() => {
    sliderCtx = sliderRef.getContext('2d', { willReadFrequently: true })!;
    drawSlider(sliderCtx);
    drawSliderHandle(sliderCtx, CONFIG.inlineMargin, 'red');

    pickerCtx = pickerRef.getContext('2d', { willReadFrequently: true })!;
    drawPicker(pickerCtx)
  });

  const handleMouseMove = (event: MouseEvent) => {
    if (event.buttons === 1) {
      const { offsetX } = event;
      if (offsetX < CONFIG.inlineMargin || offsetX > CONFIG.width - CONFIG.inlineMargin) return;
      sliderCtx.clearRect(0, 0, sliderRef.width, sliderRef.height);
      drawSlider(sliderCtx);
      const [red, green, blue] = getRGBFromPixel(sliderCtx, offsetX, 15);
      setHue(rgbToHue(red, green, blue));
      drawSliderHandle(sliderCtx, offsetX, `rgb(${red}, ${green}, ${blue})`);
    }
  }

  createEffect(() => {
    drawPicker(pickerCtx, hue());
  });

  createEffect(() => {
    const [red, green, blue] = state.color;
    previewRef.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    triggerRef.value = rgbToHex(red, green, blue);
  });

  const handlePickerClick = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    pickerCtx.clearRect(0, 0, pickerCtx.canvas.width, pickerCtx.canvas.height);
    drawPicker(pickerCtx, hue());
    drawSelectorAt(pickerCtx, offsetX, offsetY);
    updateState({ color: getRGBFromPixel(pickerCtx, offsetX, offsetY) });
  }

  const handlePickerMove = (event: MouseEvent) => {
    if (event.buttons !== 1) return;
    const { offsetX, offsetY } = event;
    pickerCtx.clearRect(0, 0, pickerCtx.canvas.width, pickerCtx.canvas.height);
    drawPicker(pickerCtx, hue());
    drawSelectorAt(pickerCtx, offsetX, offsetY);
    const [red, green, blue] = getRGBFromPixel(pickerCtx, offsetX, offsetY);
    previewRef.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
  }

  let popoverRef: HTMLDivElement;

  const toggleColorPicker = (event: MouseEvent) => {
    event.preventDefault();
    popoverRef.showPopover();
  }

  return <>
    <input class="toggle" ref={triggerRef!} type="color" onClick={toggleColorPicker}/>
    <Card ref={popoverRef!} title="Color picker" id="color-picker" popover="auto">
      <div class="color-picker">
        <div class="preview" ref={previewRef!}></div>
        <canvas
          class="color"
          ref={pickerRef!}
          width={CONFIG.width}
          height={CONFIG.pickerHeight}
          onClick={handlePickerClick}
          onMouseMove={handlePickerMove}
        >
        </canvas>

        <canvas
          class="slider"
          ref={sliderRef!}
          width={CONFIG.width}
          height={CONFIG.sliderHeight}
          onMouseMove={handleMouseMove}>
        </canvas>
      </div>
    </Card>
  </>
}
