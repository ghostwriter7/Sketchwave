import { GradientPreview } from './gradient-preview.tsx';
import styles from './gradient-generator.module.css';
import { createMemo, createSignal, For, Show } from 'solid-js';
import { type GradientDefinition, useGradientContext } from './gradient-generator.tsx';
import { clampValue } from '../../math/clamp-value.ts';
import { Color } from '../../types/Color.ts';
import { ColorPicker } from '../tools/color-picker/color-picker/color-picker.tsx';

export const GradientInput = () => {
  const { state, insertStop, setStopColor, positionStop, sortedGradientDefinitions } = useGradientContext();
  const [activeIndicatorId, setActiveIndicatorId] = createSignal<string | null>(null);
  const [draggedIndicatorId, setDraggedIndicatorId] = createSignal<string | null>(null);
  const width = 400;
  const indicatorHeight = `70px`;
  const indicatorWidth = 10;
  const startMargin = 50;

  const stopDragging = () => setDraggedIndicatorId(null);

  const activeStop = createMemo((): GradientDefinition | null => {
    const id = activeIndicatorId();
    return id ? state.gradientDefinitions.find((def) => def.id === id)! : null;
  });

  document.addEventListener('mouseup', stopDragging);

  return <>
    <div
      class={styles['gradient-input']}
      onClick={(event: MouseEvent) => {
        const color = new Color(255, 255, 255);
        const id = insertStop((event.clientX - startMargin) / width, color);
        setActiveIndicatorId(id);
      }}
      onMouseMove={(event: MouseEvent) => {
        const id = draggedIndicatorId();
        if (id) {
          const offset = clampValue(event.clientX - startMargin, 0, 400) / width;
          positionStop(id, offset);
        }
      }}
      onMouseLeave={stopDragging}
    >
      <For each={sortedGradientDefinitions()}>
        {(({ color, id, stop }) =>
          <span
            class={styles['stop-indicator']}
            classList={{
              [styles.active]: activeIndicatorId() === id
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
              setActiveIndicatorId(id);
            }}
          ></span>)}
      </For>
      <GradientPreview height={50} width={width}/>
    </div>
    <Show when={activeIndicatorId()}>
      <ColorPicker
        alpha={1}
        color={(activeStop() as GradientDefinition).color}
        onChange={(color: Color) => setStopColor(activeIndicatorId()!, color)}
      />
    </Show>
  </>
}
