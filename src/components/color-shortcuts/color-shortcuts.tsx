import { useGlobalContext } from '../../global-provider.tsx';
import { For, type ParentProps } from 'solid-js';
import styles from './color-shortcuts.module.css';
import { ColorPickEvent } from '../../types/events.ts';

export const ColorShortcuts = (props: ParentProps<{ class: string }>) => {
  const { state, setColor } = useGlobalContext();

  return <div class={`${styles['color-shortcuts']} ${props.class || ''}`}>
    <For each={state.colorShortcuts}>
      {(color) => <button class={styles.color} style={{ background: color.toString() }} onClick={() =>{
        setColor(color);
        dispatchEvent(new ColorPickEvent(color));
      }}></button>}
    </For>
  </div>;
}
