import styles from './color-picker.module.css';
import { createEffect } from 'solid-js';
import { useGlobalContext } from '../../../global-provider.tsx';
import { Card } from '../../card/card.tsx';
import { HueRange } from './hue-range/hue-range.tsx';
import { SaturationBrightnessRange } from './saturation-brightness-range/saturation-brightness-range.tsx';
import { AlphaRange } from './alpha-range/alpha-range.tsx';
import { Color } from '../../../types/Color.ts';

export const ColorPicker = () => {
  const { state } = useGlobalContext();

  let popoverRef!: HTMLElement;
  let previewRef!: HTMLDivElement;
  let triggerRef!: HTMLInputElement;

  createEffect(() => {
    const [red, green, blue] = state.color;
    const color = new Color(red, green, blue, state.alpha);
    previewRef.style.backgroundColor = color.toString();
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
        <div class={styles.preview} ref={previewRef!}></div>
        <SaturationBrightnessRange/>
        <HueRange/>
        <AlphaRange/>
      </div>
    </Card>
  </>
}
