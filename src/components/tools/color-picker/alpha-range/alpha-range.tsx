import styles from '../color-picker.module.css';
import { createEffect } from 'solid-js';
import { ThemeHelper } from '../../../../helpers/theme.helper.ts';
import { useGlobalContext } from '../../../../global-provider.tsx';
import type { RGBa } from '../../../../types/core.type.ts';
import { setColorState } from '../color-store.ts';

export const AlphaRange = () => {
  const { state } = useGlobalContext();

  const pickAlpha = (event: MouseEvent) => {
    setColorState('alpha', event.offsetY / 255);
  }

  const handleMove = (event: MouseEvent) => event.buttons == 1 && pickAlpha(event);

  const canvas = <canvas
    class={styles.alpha}
    height="255"
    width="30"
    onClick={pickAlpha}
    onMouseMove={handleMove}
  ></canvas> as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  const darkTileColor = ThemeHelper.getColor('clr-secondary');
  const lightTileColor = ThemeHelper.getColor('clr-primary');

  const renderChessboard = () => {
    for (let x = 0; x < 30; x += 10) {
      let isDark = [0, 20].includes(x);

      for (let y = 0; y < 255; y += 10) {
        isDark = !isDark;
        ctx.beginPath();
        ctx.fillStyle = isDark ? darkTileColor : lightTileColor;
        ctx.fillRect(x, y, 10, 10);
      }
    }
  }

  const renderColorAlphaRange = (color: RGBa) => {
    const baseColor = `rgb(${color[0]}, ${color[1]}, ${color[2]}, `;
    const gradient = ctx.createLinearGradient(0, 0, 0, 255);
    for (let a = 1; a > 0; a -= .01) {
      gradient.addColorStop(a, `${baseColor}${a})`);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  createEffect(() => {
    const color = state.color;
    renderChessboard();
    renderColorAlphaRange(color);
  });

  return canvas;
}
