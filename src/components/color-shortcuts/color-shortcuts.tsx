import { useGlobalContext } from '../../global-provider.tsx';
import { For } from 'solid-js';
import styles from './color-shortcuts.module.css';
import { ColorPickEvent } from '../../types/events.ts';

export const ColorShortcuts = () => {
  const { state, setColor } = useGlobalContext();

  return <div class={styles['color-shortcuts']}>
    <For each={state.colorShortcuts}>
      {(color) => <button class={styles.color} style={{ background: color.toString() }} onClick={() =>{
        setColor(color);
        dispatchEvent(new ColorPickEvent(color));
      }}></button>}
    </For>
  </div>;
}
