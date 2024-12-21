import styles from './gradient-generator.module.css';
import { useGlobalContext } from '../../global-provider.tsx';
import { createUniqueId, For, Show } from 'solid-js';
import { GradientPreview } from './gradient-preview.tsx';
import { Icon } from '../icon/icon.tsx';
import { type Gradient, useGradientContext } from './gradient-generator.tsx';

export const GradientStoreManager = () => {
  const { state, upsertGradient, deleteGradient } = useGlobalContext();
  const { state: gradientState, editGradient, setGradientId } = useGradientContext();

  const createOrUpdateGradient = (id = createUniqueId()) => {
    const gradient: Gradient = {
      gradientDefinitions: [...gradientState.gradientDefinitions],
      gradientType: gradientState.gradientType,
      id
    };

    if (!gradientState.id) {
      setGradientId(id);
    }

    upsertGradient(gradient);
  }


  return <div class={styles.gradientStoreManager}>
    <div class={styles.storeManagerButtons}>
      <button onClick={() => createOrUpdateGradient(gradientState.id)}><Icon icon="save"/></button>
      <Show when={gradientState.id}>
        <button class={styles.saveButton} onClick={() => createOrUpdateGradient()}><Icon icon="add"/></button>
      </Show>
    </div>
    <div class={`${styles.gradientsList} scroller`}>
      <For each={state.gradients}>
        {(gradient) =>
          <div
            bool:data-active={gradient.id === gradientState.id}
            class={styles.gradientListItem}
            onClick={() => editGradient(gradient)}>
            <GradientPreview width={125} height={50} gradient={gradient}/>
            <button onClick={() => deleteGradient(gradient.id!)}><Icon icon="delete"/></button>
          </div>}
      </For></div>
  </div>
}
