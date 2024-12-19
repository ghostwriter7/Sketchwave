import { GradientPreview } from './gradient-preview.tsx';
import styles from './gradient-generator.module.css';
import { For } from 'solid-js';
import { useGradientContext } from './gradient-generator.tsx';

export const GradientInput = () => {
  const { state } = useGradientContext();
  const width = 400;
  const indicatorHeight = `70px`;
  const indicatorWidth = 10;

  return <div class={styles['gradient-input']}>
    <GradientPreview height={50} width={width}/>
    <For each={state.gradientDefinitions}>
      {(({ color, stop }) =>
        <span
          class={styles['stop-indicator']}
          style={{
            background: color.toString(),
            height: indicatorHeight,
            width: `${indicatorWidth}px`,
            left: `${stop * width - indicatorWidth / 2}px`,
            top: `${-indicatorWidth}px`
          }}
        ></span>)}
    </For>
  </div>
}
