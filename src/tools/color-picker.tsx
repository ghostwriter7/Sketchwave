import { onMount } from 'solid-js';

const SLIDER_CONFIG = {
  inlineMargin: 25,
  topEdgeY: 10,
  bottomEdgeY: 20,
  cornerRadius: 5,
  handleRadius: 10,
  handleOutline: 12,
  sliderWidth: 300,
  sliderHeight: 30,
};

const FULL_CIRCLE = 2 * Math.PI;
const CENTER_Y = SLIDER_CONFIG.sliderHeight / 2;

const drawSlider = (ctx: CanvasRenderingContext2D) => {
  const { bottomEdgeY, cornerRadius, inlineMargin, sliderWidth, topEdgeY } = SLIDER_CONFIG;

  const gradient = ctx.createLinearGradient(inlineMargin, 0, sliderWidth - inlineMargin, 0);
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

  path.lineTo(sliderWidth - inlineMargin - cornerRadius, topEdgeY);
  path.arcTo(sliderWidth - inlineMargin, topEdgeY, sliderWidth - inlineMargin, topEdgeY + cornerRadius, cornerRadius);

  path.lineTo(sliderWidth - inlineMargin, bottomEdgeY - cornerRadius);
  path.arcTo(sliderWidth - inlineMargin, bottomEdgeY, sliderWidth - inlineMargin - cornerRadius, bottomEdgeY, cornerRadius);

  path.lineTo(inlineMargin + cornerRadius, bottomEdgeY);
  path.arcTo(inlineMargin, bottomEdgeY, inlineMargin, bottomEdgeY - cornerRadius, cornerRadius);

  path.lineTo(inlineMargin, topEdgeY + cornerRadius);
  path.arcTo(inlineMargin, topEdgeY, inlineMargin + cornerRadius, topEdgeY, cornerRadius);

  ctx.fill(path);
}

const drawSliderHandle = (ctx: CanvasRenderingContext2D, x: number, color: string) => {
  const { handleOutline, handleRadius } = SLIDER_CONFIG;
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

const getRGBFromPixel = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  const pixel = ctx.getImageData(x, y, 1, 1);
  const [red, green, blue] = pixel.data;
  return `rgb(${red}, ${green}, ${blue})`;
}


export const ColorPicker = () => {
  let ref: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  onMount(() => {
    ctx = ref.getContext('2d', { willReadFrequently: true })!;
    drawSlider(ctx);
    drawSliderHandle(ctx, SLIDER_CONFIG.inlineMargin, 'red');
  });

  const handleMouseMove = (event: MouseEvent) => {
    if (event.buttons === 1) {
      const { offsetX } = event;
      if (offsetX < SLIDER_CONFIG.inlineMargin || offsetX > SLIDER_CONFIG.sliderWidth - SLIDER_CONFIG.inlineMargin) return;
      ctx.clearRect(0, 0, ref.width, ref.height);
      drawSlider(ctx);
      drawSliderHandle(ctx, offsetX, getRGBFromPixel(ctx, offsetX, 15));
    }
  }

  return <div style="position: absolute; left: 200px; top: 200px; background-color: #131414; height: 30px;">
    <canvas ref={ref}
            width={SLIDER_CONFIG.sliderWidth}
            height={SLIDER_CONFIG.sliderHeight}
            onMouseMove={handleMouseMove}>
    </canvas>
  </div>

}
