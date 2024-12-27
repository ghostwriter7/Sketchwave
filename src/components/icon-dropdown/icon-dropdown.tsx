import { For, type VoidProps, createUniqueId, Show } from 'solid-js';
import type { Options, OptionValue } from '../../types/core.type.ts';
import styles from './icon-dropdown.module.css';
import { Icon } from '../icon/icon.tsx';
import { Card } from '../card/card.tsx';

export type IconDropdownProps<T = OptionValue> = {
  icon: string;
  options: Options<T>;
  onChange: (value: T) => void;
  title: string;
}

export const IconDropdown = (props: VoidProps<IconDropdownProps>) => {
  const popoverId = `icon-dropdown_${Math.random()}`;

  const anchorName = `--${createUniqueId()}`;
  return <div class={styles.wrapper} >
    <button title={props.title} popovertarget={popoverId} style={{'anchor-name': anchorName }}>
      <Icon icon={props.icon}/>
    </button>
    <div popover id={popoverId} style={{'position-anchor': anchorName}} class={styles.popover} >
        <Card title={props.title}>
          <div class={styles.options}>
            <For each={props.options}>
            {({ value, label, icon }) =>
              <button class={styles.option}>
                <Show when={icon}><Icon icon={icon!}/></Show>
                {label}
              </button>}
          </For></div>
        </Card>
    </div>
  </div>
}
