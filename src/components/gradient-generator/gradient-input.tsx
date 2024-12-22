import { GradientPreview } from './gradient-preview.tsx';
import styles from './gradient-generator.module.css';
import { createSignal, For, onCleanup } from 'solid-js';
import { useGradientContext } from './gradient-generator.tsx';
import { clampValue } from '../../math/clamp-value.ts';
import { Color } from '../../types/Color.ts';
import { ColorPicker } from '../tools/color-picker/color-picker/color-picker.tsx';

export const GradientInput = () => {
  const { activeStop, state, insertStop, setStopColor, positionStop, setActiveStopId } = useGradientContext();
  const [draggedIndicatorId, setDraggedIndicatorId] = createSignal<string | null>(null);
  const width = 500;
  const indicatorHeight = `70px`;
  const indicatorWidth = 10;

  let gradientInputRef!: HTMLDivElement;

  const abortController = new AbortController();

  const stopDragging = () => setDraggedIndicatorId(null);

  const computeOffset = (event: MouseEvent) => {
    const { left } = gradientInputRef.getBoundingClientRect();
    return event.clientX - left;
  }

  document.addEventListener('mouseup', stopDragging, { signal: abortController.signal });

  const insertNewStopIndicator = (event: MouseEvent) => {
    const color = new Color(255, 255, 255);
    const id = insertStop(computeOffset(event) / width, color);
    setActiveStopId(id);
  }

  const tryMoveStopIndicator = (event: MouseEvent) => {
    const id = draggedIndicatorId();
    if (id) {
      const offset = clampValue(computeOffset(event), 0, width) / width;
      positionStop(id, offset);
    }
  }

  onCleanup(() => abortController.abort());

  return <>
    <div
      ref={gradientInputRef}
      class={styles.gradientInput}
      onClick={insertNewStopIndicator}
      onMouseMove={tryMoveStopIndicator}
      onMouseLeave={stopDragging}
    >
      <For each={state.gradientDefinitions}>
        {(({ color, id, stop }) =>
          <span
            class={styles.stopIndicator}
            classList={{
              [styles.active]: state.activeStopId === id
            }}
            style={{
              background: color.toString(),
              height: indicatorHeight,
              width: `${indicatorWidth}px`,
              transform: `translate(${stop * width - indicatorWidth / 2}px, ${-indicatorWidth}px)`,
            }}
            onMouseDown={() => setDraggedIndicatorId(id)}
            onClick={(event: MouseEvent) => {
              event.stopPropagation();
              setActiveStopId(id);
            }}
          ></span>)}
      </For>
      <GradientPreview
        gradient={{
          gradientDefinitions: state.gradientDefinitions,
          gradientType: 'linear',
        }}
        height={50}
        width={width}/>
    </div>
    <div class={styles.colorPicker}>
      <ColorPicker
        alpha={activeStop().color.alpha}
        color={activeStop().color}
        onChange={(color: Color) => setStopColor(state.activeStopId!, color)}
      />
    </div>
  </>
}
