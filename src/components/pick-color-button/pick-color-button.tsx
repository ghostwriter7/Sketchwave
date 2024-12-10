import { Icon } from '../icon/icon.tsx';
import { useGlobalContext } from '../../global-provider.tsx';
import { createEffect } from 'solid-js';
import styles from './pick-color-button.module.css';
import { ThemeHelper } from '../../helpers/theme.helper.ts';
import { createStore } from 'solid-js/store';

type PickColorState = {
  previewRef?: HTMLCanvasElement;
  working: boolean;
}

export const PickColorButton = () => {
  const { state, setActiveTool, setColor } = useGlobalContext();
  const [localState, setLocalState] = createStore<PickColorState>({
    working: false,
  });
  let abortController = new AbortController();

  const activatePickColorTool = () => {
    if (localState.working) return;

    setActiveTool();
    const options = { signal: abortController.signal };

    const previewColorRef = <canvas
      class={styles.pickColorPreview}
      height="100"
      width="100"
    ></canvas> as HTMLCanvasElement;

    setLocalState({
      working: true,
      previewRef: previewColorRef,
    })

    const ctx = previewColorRef.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    ctx.strokeStyle = ThemeHelper.getColor('clr-primary');

    const positionPreview = (event: MouseEvent) =>
      previewColorRef.style.transform = `translate(${event.pageX + 25}px, ${event.pageY - 125}px)`;

    const updatePreview = (event: MouseEvent) => {
      ctx.clearRect(0, 0, previewColorRef.width, previewColorRef.height);
      ctx.drawImage(state.ctx!.canvas, event.offsetX - 2, event.offsetY - 2, 5, 5, 0, 0, 100, 100);
      ctx.strokeRect(40, 40, 20, 20);
    }

    const insertPreview = () => {
      !previewColorRef.parentNode && document.body.appendChild(previewColorRef);
      !localState.previewRef && setLocalState('previewRef', previewColorRef);
    }

    state.ctx!.canvas.addEventListener('mouseenter', (event: MouseEvent) => {
      insertPreview();
      positionPreview(event);
      updatePreview(event);
    }, options);

    state.ctx!.canvas.addEventListener('mouseleave', () => {
      previewColorRef.remove();
      setLocalState('previewRef', undefined);
    }, options);

    state.ctx!.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      insertPreview();
      positionPreview(event);
      updatePreview(event);
    }, options);

    state.ctx!.canvas.addEventListener('click', (event: MouseEvent) => {
      const [red, green, blue, alpha] = state.ctx!.getImageData(event.offsetX, event.offsetY, 1, 1).data;
      setColor([red, green, blue, alpha]);
    }, options)
  }

  createEffect(() => {
    if (state.activeTool && localState.working) {
      abortController.abort();
      abortController = new AbortController();
      localState.previewRef?.remove();
      setLocalState({ working: false, previewRef: undefined })
    }
  });

  return <button
    classList={{ active: localState.working }}
    id="pickColor"
    title="Pick Color (P)"
    onClick={activatePickColorTool}>
    <Icon icon="colorize"/>
  </button>
}
