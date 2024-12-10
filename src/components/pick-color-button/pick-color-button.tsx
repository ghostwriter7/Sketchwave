import { Icon } from '../icon/icon.tsx';
import { useGlobalContext } from '../../global-provider.tsx';
import { createEffect, createSignal } from 'solid-js';
import styles from './pick-color-button.module.css';

export const PickColorButton = () => {
  const { state, setActiveTool, setColor } = useGlobalContext();
  const [working, setWorking] = createSignal(false);
  let abortController = new AbortController();

  const activatePickColorTool = () => {
    setWorking(true);
    setActiveTool();
    const options = { signal: abortController.signal };

    const imageData = state.ctx!.getImageData(0, 0, state.ctx!.canvas.width, state.ctx!.canvas.height)!;

    const previewColorRef = <canvas
      class={styles.pickColorPreview}
      height="100"
      width="100"
    ></canvas> as HTMLCanvasElement;

    const positionPreview = (event: MouseEvent) =>
      previewColorRef.style.transform = `translate(${event.pageX + 25}px, ${event.pageY - 125}px)`;

    state.ctx!.canvas.addEventListener('mouseenter', (event: MouseEvent) => {
      document.body.appendChild(previewColorRef);
      positionPreview(event);
    }, options);

    state.ctx!.canvas.addEventListener('mouseleave', (event: MouseEvent) => {
      previewColorRef.remove();
    }, options);

    state.ctx!.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      positionPreview(event);
    }, options);
  }

  createEffect(() => {
    if (state.activeTool && working()) {
      abortController.abort();
      abortController = new AbortController();
      setWorking(false);
    }
  });

  return <button id="pickColor" title="Pick Color (P)" onClick={activatePickColorTool}>
    <Icon icon="colorize"/>
  </button>
}
