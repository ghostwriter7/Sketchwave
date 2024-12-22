import { createUniqueId, For, type ParentProps } from 'solid-js';
import styles from './radio-group.module.css';
export const RadioGroup = (props: ParentProps<{
  options: { label: string; value: string  }[];
  value: string;
  onChange: (value: string) => void;
}>) => {
  const name = createUniqueId();

  return <div class={styles.radioGroup}>
    <For each={props.options}>
      {({ value, label }) =>
        <>
          <label
            class={styles.label}
            for={value}>
            {label}
          </label>
          <input
            class={styles.input}
            // @ts-ignore
            bool:checked={value === props.value}
            id={value}
            name={name}
            value={value}
            type="radio"
            onChange={() => props.onChange(value)}
          />
        </>
      }
    </For>
  </div>
}
