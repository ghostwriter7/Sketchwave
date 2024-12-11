import styles from '../color-picker.module.css';
export const AlphaRange = () => {
  const canvas = <canvas class={styles.alpha} width="50" height="255"></canvas> as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  return canvas;
}
