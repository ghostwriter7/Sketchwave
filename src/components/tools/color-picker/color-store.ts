import { createStore } from 'solid-js/store';

type ColorStore = {
  hue: number;
}

const [colorState, setColorState] = createStore<ColorStore>({
  hue: 0,
});

export { colorState, setColorState };
