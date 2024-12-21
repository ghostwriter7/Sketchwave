import styles from './gradient-generator.module.css';
import { useGradientContext } from './gradient-generator.tsx';
import { createMemo, For } from 'solid-js';
import { Icon } from '../icon/icon.tsx';

export const StopList = () => {
  const { setActiveStopId, state, removeStop } = useGradientContext();

  const isRemoveDisabled = createMemo(() => state.gradientDefinitions.length == 2);

  return <div class={`${styles.stopList} scroller`}>
    <For each={state.gradientDefinitions}>
      {({ color, id }, index) =>
        <div
          bool:data-active={state.activeStopId === id}
          class={styles.stopListItem}
          onClick={() => setActiveStopId(id)}>
          <span>#{index() + 1}</span>
          <span>{color.toString()}</span>
          <button
            disabled={isRemoveDisabled()}
            onClick={(event) => {
              event.stopPropagation();
              removeStop(id);
            }}>
            <Icon icon="close"/>
          </button>
        </div>}
    </For>
  </div>
}
