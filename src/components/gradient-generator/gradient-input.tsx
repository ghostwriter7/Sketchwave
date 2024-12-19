import { GradientPreview } from './gradient-preview.tsx';
import styles from './gradient-generator.module.css';
import { createSignal, For } from 'solid-js';
import { useGradientContext } from './gradient-generator.tsx';
import { clampValue } from '../../math/clamp-value.ts';
import { Color } from '../../types/Color.ts';

export const GradientInput = () => {
  const { insertStop, positionStop, sortedGradientDefinitions } = useGradientContext();
  const [activeIndicatorId, setActiveIndicatorId] = createSignal<string | null>(null);
  const [draggedIndicatorId, setDraggedIndicatorId] = createSignal<string | null>(null);
  const width = 400;
  const indicatorHeight = `70px`;
  const indicatorWidth = 10;
  const startMargin = 50;

  const stopDragging = () => setDraggedIndicatorId(null);

  document.addEventListener('mouseup', stopDragging);

  return <div
    class={styles['gradient-input']}
    onClick={(event: MouseEvent) => {
      const id = insertStop((event.clientX - startMargin) / width, new Color(255, 255, 255));
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
}
