import { getRGBFromPixel } from '../../../../color/get-rgb-from-pixel.ts';
import { Point } from '../../../../types/Point.ts';
import { rgbToHue } from '../../../../color/rgb-to-hue.ts';
import { onMount } from 'solid-js';
import { CONFIG } from '../config.ts';
import styles from '../color-picker.module.css';
import { FULL_CIRCLE } from '../../../../constants.ts';
import { setColorState } from '../color-store.ts';
import { stringifyRgb } from '../../../../color/stringify-rgb.ts';

const CENTER_Y = CONFIG.sliderHeight / 2;

export const HueRange = () => {
  let sliderRef!: HTMLCanvasElement;
  let sliderCtx!: CanvasRenderingContext2D;

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

  const pickHue = (event: MouseEvent) => {
    const { offsetX } = event;
    if (offsetX < CONFIG.inlineMargin || offsetX > CONFIG.width - CONFIG.inlineMargin) return;
    sliderCtx.clearRect(0, 0, sliderRef.width, sliderRef.height);
    drawSlider(sliderCtx);
    const [red, green, blue] = getRGBFromPixel(sliderCtx, new Point(offsetX, 15));
    setColorState('hue', rgbToHue(red, green, blue));
    drawSliderHandle(sliderCtx, offsetX, stringifyRgb([red, green, blue, 255]));
  }

  const handleMouseMove = (event: MouseEvent) => event.buttons === 1 && pickHue(event);

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

  onMount(() => {
    sliderCtx = sliderRef.getContext('2d')!;
    drawSlider(sliderCtx);
    drawSliderHandle(sliderCtx, CONFIG.inlineMargin, 'red');
  })

  return <canvas
    class={styles.colorPicker}
    ref={sliderRef!}
    width={CONFIG.width}
    height={CONFIG.sliderHeight}
    onClick={pickHue}
    onMouseMove={handleMouseMove}>
  </canvas>
}
