import styles from './grid-settings.module.css';
import { Icon } from '../../../../components/icon/icon.tsx';
import { createStore } from 'solid-js/store';
import type { JSX } from 'solid-js';
import { useGlobalContext } from '../../../../global-provider.tsx';
import { ThemeHelper } from '../../../../utils/ThemeHelper.ts';

export const GridSettings = () => {
  const { state } = useGlobalContext();
  const [store, setStore] = createStore({
    size: 300,
    row: 2,
    col: 4
  });

  const isInvalid = () => !store.size || !store.row || !store.col;

  const setValue = (prop: keyof typeof store): JSX.InputEventHandler<HTMLInputElement, InputEvent> =>
    (e) => setStore(prop, parseInt(e.target.value));

  const applyGridSettings = () => {
    const layerFacade = state.layerFacade!;
    const { size, row, col } = store;
    const padding = 10;
    const gap = 5;
    const width = padding + col * size + (col - 1) * gap;
    const height = padding + row * size + (row - 1) * gap;
    const originX = 5;
    const originY = 5;
    layerFacade.clearLayers();
    layerFacade.pushLayer({
      canvasWidth: width,
      canvasHeight: height,
      draw: (ctx: CanvasRenderingContext2D)=> {
        ctx.fillStyle = ThemeHelper.getColor('gray');
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = ThemeHelper.getColor('bg-primary');

        for (let x = 0; x < col; x++) {
          for (let y = 0; y < row; y++) {
            ctx.fillRect(originX + x * size + x * gap, originY + y * size + y * gap, size, size);
          }
        }
      },
      tool: 'GridSettings'
    });
    layerFacade.renderLayers();
  }

  return <div class={styles.wrapper}>
    <label class={styles.label}>
      Row
      <input
        class={`interactive ${styles.input}`}
        max={8}
        value={store.row}
        onInput={setValue('row')}
        type="number"/>
    </label>
    <label class={styles.label}>
      Col:
      <input
        class={`interactive ${styles.input}`}
        max={8}
        value={store.col}
        onInput={setValue('col')}
        type="number"/>
    </label>
    <label class={styles.label}>
      Size:
      <input
        class={`interactive ${styles.input}`}
        max={250}
        onInput={setValue('size')}
        value={store.size}
        type="number"/>
    </label>
    <button
      disabled={isInvalid()}
      class={styles.button}
      onClick={applyGridSettings}
    ><Icon icon="check"/></button>
  </div>
}
