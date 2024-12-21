import { onMount, type VoidProps } from 'solid-js';
import { CONFIG } from '../config.ts';
import styles from '../color-picker/color-picker.module.css';
import { FULL_CIRCLE } from '../../../../constants.ts';
import { Color } from '../../../../types/Color.ts';
import type { RGBA } from '../../../../types/core.type.ts';
import { ColorHelper } from '../../../../utils/ColorHelper.ts';
import type { ComputeNewHueFn } from '../color-picker/color-picker.tsx';

const CENTER_Y = CONFIG.sliderHeight / 2;

export const HueRange = (props: VoidProps<{
  color: Color;
  onChange: (hue: number) => void;
  setComputeNewHue: (fn: ComputeNewHueFn) => void;
}>) => {
  let sliderRef!: HTMLCanvasElement;
  let sliderCtx!: CanvasRenderingContext2D;

  props.setComputeNewHue((color: Color) => {
    const closestColorIndex = ColorHelper.findClosestColorIndexInRange(color, colors);
    const offset = CONFIG.inlineMargin + closestColorIndex;
    redrawPicker(offset, color);
  })

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

  const redrawPicker = (x: number, color?: Color) => {
    sliderCtx.clearRect(0, 0, sliderRef.width, sliderRef.height);
    drawSlider(sliderCtx);
    color = color || sliderCtx.getColorFromPixel(x, 15)
    drawSliderHandle(sliderCtx, x, color.withAlpha(1).toString());
    props.onChange(color.toHue());
  }

  const pickHue = (event: MouseEvent) => {
    const { offsetX } = event;
    if (offsetX < CONFIG.inlineMargin || offsetX > CONFIG.width - CONFIG.inlineMargin) return;
    redrawPicker(offsetX);
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

  let colors: RGBA[];

  onMount(() => {
    sliderCtx = sliderRef.getContext('2d', { willReadFrequently: true })!;
    drawSlider(sliderCtx);
    drawSliderHandle(sliderCtx, CONFIG.inlineMargin, 'red');
    colors = [...sliderCtx.getImageData(CONFIG.inlineMargin, 15, sliderRef.width - CONFIG.inlineMargin, 1)
      .data].chunk(4) as RGBA[];
  });

  return <canvas
    class={styles.slider}
    ref={sliderRef!}
    width={CONFIG.width}
    height={CONFIG.sliderHeight}
    onClick={pickHue}
    onMouseMove={handleMouseMove}>
  </canvas>
}
