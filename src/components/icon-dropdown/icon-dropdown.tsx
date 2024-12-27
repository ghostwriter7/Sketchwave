import { For, type VoidProps } from 'solid-js';
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
  const anchorName = `--anchor${Math.random()}`;

  return <div class={styles.wrapper} style={{ anchorName }} >
    <button title={props.title} popovertarget={popoverId}>
      <Icon icon={props.icon}/>
    </button>
    <div class={styles.popver} popover id={popoverId}>
      <Card title={props.title} style={{ 'position-anchor': anchorName, left: `anchor(left)`, top: `anchor(bottom)` }}>
        <For each={props.options}>
        {({ value, label, icon }) =>
          <span>{label}</span>}
      </For>
      </Card>
    </div>
  </div>
}
