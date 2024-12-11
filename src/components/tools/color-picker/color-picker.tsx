import './color-picker.css';
import { createEffect } from 'solid-js';
import { useGlobalContext } from '../../../global-provider.tsx';
import { rgbToHex } from '../../../color/rgb-to-hex.ts';
import { Card } from '../../card/card.tsx';
import { HueRange } from './hue-range/hue-range.tsx';
import { SaturationBrightnessRange } from './saturation-brightness-range/saturation-brightness-range.tsx';

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
    <input tabindex="0" id="color-picker-button" class="button interactive" ref={triggerRef!} type="color"
           onClick={toggleColorPicker} title="Color (C)"/>
    <Card ref={popoverRef!} title="Color picker" id="color-picker" popover="auto">
      <div class="color-picker">
        <div class="preview" ref={previewRef!}></div>
        <SaturationBrightnessRange />
        <HueRange />
      </div>
    </Card>
  </>
}
