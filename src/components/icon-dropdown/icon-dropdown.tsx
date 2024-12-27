import { For, type VoidProps, Show, onMount, type Accessor, onCleanup } from 'solid-js';
import type { Options, OptionValue } from '../../types/core.type.ts';
import styles from './icon-dropdown.module.css';
import { Icon } from '../icon/icon.tsx';
import { Card } from '../card/card.tsx';

export type IconDropdownProps<T = OptionValue> = {
  id: string;
  icon: string;
  isActive?: Accessor<boolean>;
  value?: T;
  options: Options<T>;
  onChange: (value: T) => void;
  title: string;
}

export const IconDropdown = (props: VoidProps<IconDropdownProps>) => {
  let popoverRef!: HTMLDivElement;
  const popoverId = `popover-${props.id}`;
  const anchorName = `--anchor-${props.id}`;

  const toggleEventHandler = (event: Event) => {
    if ((event as ToggleEvent).newState === 'open') {
      (popoverRef.querySelector('button') as HTMLButtonElement).focus();
    }
  };

  onMount(() => popoverRef.addEventListener('toggle', toggleEventHandler));
  onCleanup(() => popoverRef.removeEventListener('toggle', toggleEventHandler));

  return <div class={styles.wrapper}>
    <button
      id={props.id}
      classList={{ active: props.isActive?.() }}
      title={props.title}
      popovertarget={popoverId}
      // @ts-ignore
      style={{ 'anchor-name': anchorName }}
    >
      <Icon icon={props.icon}/>
    </button>
    <div
      class={styles.popover}
      id={popoverId}
      popover
      ref={popoverRef}
      // @ts-ignore
      style={{ 'position-anchor': anchorName }}>
      <Card title={props.title}>
        <div class={styles.options}>
          <For each={props.options}>
            {({ value, label, icon }) =>
              <button
                class={styles.option}
                classList={{ active: value === props.value }}
                onClick={() => {
                  props.onChange(value);
                  popoverRef.hidePopover();
                }}
              >
                <Show when={icon}><Icon icon={icon!}/></Show>
                {label}
              </button>}
          </For></div>
      </Card>
    </div>
  </div>
}
