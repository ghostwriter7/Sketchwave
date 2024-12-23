import { type Accessor, createUniqueId, For, type VoidProps } from 'solid-js';
import styles from './select.module.css';

export type SelectProps<T = string | number> = {
  disabled?: Accessor<boolean>;
  options: { disabled?: Accessor<boolean>; label: string; value: T }[];
  label: string;
  value: Accessor<T>;
  onChange: (value: T) => void;
}

export const Select = (props: VoidProps<SelectProps>) => {
  const uniqueId = createUniqueId();

  return <div class={styles.wrapper}>
    <label for={uniqueId}>{props.label}</label>
    <select
      disabled={props.disabled?.()}
      class={styles.select}
      id={uniqueId}
      onChange={(event: Event) => props.onChange((event.target as HTMLSelectElement).value)
      }>
      <For each={props.options}>
        {({ value, label, disabled }) =>
          <option
            disabled={disabled?.()}
            value={value}
            selected={value === props.value()}
          >{label}</option>}
      </For>
    </select>
  </div>
}
