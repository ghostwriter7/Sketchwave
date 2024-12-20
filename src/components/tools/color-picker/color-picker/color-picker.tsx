import styles from './color-picker.module.css';
import { SaturationBrightnessRange } from '../saturation-brightness-range/saturation-brightness-range.tsx';
import { HueRange } from '../hue-range/hue-range.tsx';
import { AlphaRange } from '../alpha-range/alpha-range.tsx';
import { createEffect, createSignal, type VoidProps } from 'solid-js';
import { Color } from '../../../../types/Color.ts';
import type { RGB } from '../../../../types/core.type.ts';
import { ColorShortcuts } from '../../../color-shortcuts/color-shortcuts.tsx';

export const  ColorPicker = (props: VoidProps<{
  color: Color,
  alpha: number;
  onChange: (color: Color) => void
}>) => {
  const [hue, setHue] = createSignal<number>(0);

  let previewRef!: HTMLDivElement;

  createEffect(() => {
    const [red, green, blue] = props.color;
    const color = new Color(red, green, blue, props.alpha);
    previewRef.style.backgroundColor = color.toString();
  });

  const onRGBChange = (rgb: RGB) => {
    const color = new Color(...rgb, props.alpha);
    props.onChange(color);
  }

  const onAlphaChange = (alpha: number) => {
    const [red, green, blue] = props.color;
    const color = new Color(red, green, blue, alpha);
    props.onChange(color);
  };

  return <div class={styles['color-picker']}>
    <ColorShortcuts class={styles['color-shortcuts']}  />
    <div class={styles.preview} ref={previewRef!}></div>
    <SaturationBrightnessRange hue={hue} onChange={onRGBChange}/>
    <HueRange color={props.color} setHue={setHue}/>
    <AlphaRange alpha={props.alpha} color={props.color} onChange={onAlphaChange}/>
  </div>
}
