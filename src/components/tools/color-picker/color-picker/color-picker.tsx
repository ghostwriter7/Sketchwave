import styles from './color-picker.module.css';
import { SaturationBrightnessRange } from '../saturation-brightness-range/saturation-brightness-range.tsx';
import { HueRange } from '../hue-range/hue-range.tsx';
import { AlphaRange } from '../alpha-range/alpha-range.tsx';
import { createEffect, createSignal, type VoidProps } from 'solid-js';
import { Color } from '../../../../types/Color.ts';
import { ColorShortcuts } from '../../../color-shortcuts/color-shortcuts.tsx';
import { ColorPickEvent } from '../../../../types/events.ts';

export const ColorPicker = (props: VoidProps<{
  color: Color,
  alpha: number;
  onChange: (color: Color) => void;
}>) => {
  const [hue, setHue] = createSignal<number>(0);

  let internalValue: Color | null = null;
  let colorPickerRef!: HTMLDivElement;
  let previewRef!: HTMLDivElement;

  createEffect(() => {
    if (!props.color.equals(internalValue)) {
      internalValue = props.color;
      setTimeout(() => colorPickerRef.dispatchEvent(new ColorPickEvent(internalValue!)));
    }
  });

  createEffect(() => {
    const [red, green, blue] = props.color;
    const color = new Color(red, green, blue, props.alpha);
    previewRef.style.backgroundColor = color.toString();
  });


  const updateLocalValueAndNotifyHost = (color: Color) => {
    internalValue = color;
    props.onChange(color);
  }

  const onColorShortcutPick = (color: Color) =>
    props.onChange(color);

  const onRGBChange = (rgb: Color) =>
    updateLocalValueAndNotifyHost(rgb.withAlpha(props.alpha));

  const onHueChange = (hue: number) => setHue(hue);

  const onAlphaChange = (alpha: number) =>
    updateLocalValueAndNotifyHost(props.color.withAlpha(alpha))

  return <div ref={colorPickerRef} class={`${styles['color-picker']} color-picker`}>
    <ColorShortcuts class={styles['color-shortcuts']} onChange={onColorShortcutPick}/>
    <div class={styles.preview} ref={previewRef!}></div>
    <SaturationBrightnessRange hue={hue} onChange={onRGBChange}/>
    <HueRange color={props.color} onChange={onHueChange}/>
    <AlphaRange alpha={props.alpha} color={props.color} onChange={onAlphaChange}/>
  </div>
}
