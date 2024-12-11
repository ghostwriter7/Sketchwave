import styles from '../color-picker.module.css';
import { createEffect } from 'solid-js';
import { ThemeHelper } from '../../../../helpers/theme.helper.ts';
import { useGlobalContext } from '../../../../global-provider.tsx';
import type { RGBa } from '../../../../types/core.type.ts';
import { colorState, setColorState } from '../color-store.ts';

export const AlphaRange = () => {
  const { state } = useGlobalContext();

  const pickAlpha = ({ offsetY }: MouseEvent) => {
    let alpha = offsetY / 255;
    if (alpha < 0.01) {
      alpha = 0.01;
    } else if (alpha > 1) {
      alpha = 1;
    }
    setColorState('alpha', alpha);
  }

  const handleMove = (event: MouseEvent) => event.buttons == 1 && pickAlpha(event);

  const canvas = <canvas
    class={styles.alpha}
    height="275"
    width="50"
    onClick={pickAlpha}
    onMouseMove={handleMove}
  ></canvas> as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  const margin = 10;
  const doubleMargin = 2 * margin;
  const sliderHeight = canvas.height - doubleMargin;

  const colorSecondary = ThemeHelper.getColor('clr-secondary');
  const colorPrimary = ThemeHelper.getColor('clr-primary');
  const colorActive = ThemeHelper.getColor('clr-active');

  const renderChessboard = () => {
    for (let x = margin; x < canvas.width - margin; x += 10) {
      let isDark = [0, 20].includes(x);

      for (let y = margin; y < sliderHeight; y += 10) {
        isDark = !isDark;
        ctx.beginPath();
        ctx.fillStyle = isDark ? colorSecondary : colorPrimary;
        ctx.fillRect(x, y, 10, 10);
      }
    }
  }

  const renderColorAlphaRange = (color: RGBa) => {
    const baseColor = `rgb(${color[0]}, ${color[1]}, ${color[2]}, `;
    const gradient = ctx.createLinearGradient(margin, margin, margin, sliderHeight);

    for (let a = 1; a > 0; a -= .01) {
      gradient.addColorStop(a, `${baseColor}${a})`);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(margin, margin, canvas.width - doubleMargin, sliderHeight);
  };

  const renderSelector = () => {
    const alpha = colorState.alpha;
    const y = alpha * 255;

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = colorPrimary;
    ctx.fillStyle = colorActive;
    ctx.roundRect(2, y, canvas.width - 4, 18);
    ctx.stroke();
    ctx.fill();

    ctx.font = '14px Roboto';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = colorPrimary;
    ctx.fillText(`${Math.floor(alpha * 100)}%`, 25, y + 3);
  };

  createEffect(() => {
    const color = state.color;
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderChessboard();
    renderColorAlphaRange(color);
    renderSelector();
  });

  return canvas;
}
