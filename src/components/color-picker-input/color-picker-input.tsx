import styles from './color-picker-input.module.css';
import { createEffect } from 'solid-js';
import { useGlobalContext } from '../../global-provider.tsx';
import { Card } from '../card/card.tsx';
import { Color } from '../../types/Color.ts';
import { ColorShortcuts } from '../color-shortcuts/color-shortcuts.tsx';
import { ColorPicker } from '../tools/color-picker/color-picker/color-picker.tsx';

export const ColorPickerInput = () => {
  const { state, setColor, setAlpha } = useGlobalContext();

  let popoverRef!: HTMLElement;
  let triggerRef!: HTMLInputElement;

  createEffect(() => {
    const [red, green, blue] = state.color;
    const color = new Color(red, green, blue, state.alpha);
    triggerRef.value = color.toHex();
  });

  const toggleColorPicker = (event: MouseEvent) => {
    event.preventDefault();
    popoverRef.showPopover();
  }

  return <>
    <input
      class={`${styles.input} button interactive`}
      id="color-picker-button"
      ref={triggerRef!}
      tabindex="0"
      title="Color (C)"
      type="color"
      onClick={toggleColorPicker}/>
    <Card ref={popoverRef!} title="Color picker" id="color-picker" popover="auto">
      <div class={styles['color-picker']}>
        <ColorShortcuts class={styles['color-shortcuts']} />
        <ColorPicker alpha={state.alpha} color={state.color} onChange={(color: Color) => {
          setColor(color);
          setAlpha(color.alpha);
        }} />
      </div>
    </Card>
  </>
}
