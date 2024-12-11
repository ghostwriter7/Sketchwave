import { createStore } from 'solid-js/store';

type ColorStore = {
  alpha: number;
  hue: number;
}

const [colorState, setColorState] = createStore<ColorStore>({
  alpha: 1,
  hue: 0
});

export { colorState, setColorState };
