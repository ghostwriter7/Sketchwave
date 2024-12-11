import styles from './color-picker.module.css';
import { createEffect } from 'solid-js';
import { useGlobalContext } from '../../../global-provider.tsx';
import { rgbToHex } from '../../../color/rgb-to-hex.ts';
import { Card } from '../../card/card.tsx';
import { HueRange } from './hue-range/hue-range.tsx';
import { SaturationBrightnessRange } from './saturation-brightness-range/saturation-brightness-range.tsx';
import { AlphaRange } from './alpha-range/alpha-range.tsx';

export const ColorPicker = () => {
  const { state } = useGlobalContext();

  let previewRef: HTMLDivElement;
  let triggerRef: HTMLInputElement;

  createEffect(() => {
    const [red, green, blue] = state.color;
    previewRef.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    triggerRef.value = rgbToHex(red, green, blue);
  });

  let popoverRef: HTMLDivElement;

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
