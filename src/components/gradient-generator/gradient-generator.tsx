import { GradientPreview } from './gradient-preview.tsx';
import { Color } from '../../types/Color.ts';
import { createStore } from 'solid-js/store';
import styles from './gradient-generator.module.css';
import { createContext, type ParentProps, useContext } from 'solid-js';
import { GradientInput } from './gradient-input.tsx';

export type GradientDefinition = { color: Color, stop: number };
export type GradientDefinitions = GradientDefinition[];

type GradientStore = {
  gradientDefinitions: GradientDefinitions;
  gradientType: GradientType;
}

export type GradientType = 'linear' | 'radial' | 'conic';

export const GradientContext = createContext<{ state: GradientStore }>();

export const useGradientContext = () => useContext(GradientContext)!;

export const GradientGenerator = () => {
  const [state, _setState] = createStore<GradientStore>({
    gradientDefinitions: [
      { color: Color.fromHsl(174, 100, 50), stop: 0 },
      { color: Color.fromHsl(280, 100, 50), stop: .5 },
      { color: Color.fromHsl(212, 100, 50), stop: 1 },
    ],
    gradientType: 'linear'
  });


  const Provider = (props: ParentProps) =>
    <GradientContext.Provider value={{ state }}>{props.children}</GradientContext.Provider>;

  return <div class={styles['gradient-generator']}>
    <Provider>
      <GradientPreview/>
      <GradientInput/>
    </Provider>
  </div>;
}
