import { useGlobalContext } from '../../global-provider.tsx';
import { For, type ParentProps } from 'solid-js';
import styles from './color-shortcuts.module.css';
import type { Color } from '../../types/Color.ts';

export const ColorShortcuts = (props: ParentProps<{ class?: string, onChange?: (color: Color) => void }>) => {
  const { state, setColor } = useGlobalContext();

  return <div class={`${styles['color-shortcuts']} ${props.class || ''}`}>
    <For each={state.colorShortcuts}>
      {(color) => <button class={styles.color} style={{ background: color.toString() }} onClick={() => {
        props.onChange ? props.onChange(color) : setColor(color);
      }}></button>}
    </For>
  </div>;
}
