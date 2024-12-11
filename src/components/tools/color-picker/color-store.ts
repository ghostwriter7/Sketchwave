import { createStore } from 'solid-js/store';

type ColorStore = {
  alpha: number;
  hue: number;
  rgb: [number, number, number];
}

const [colorState, setColorState] = createStore<ColorStore>({
  alpha: 1,
  hue: 0,
  rgb: [0, 0, 0]
});

export { colorState, setColorState };
