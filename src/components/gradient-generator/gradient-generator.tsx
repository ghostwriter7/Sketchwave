import { GradientPreview } from './gradient-preview.tsx';
import { Color } from '../../types/Color.ts';
import { createStore } from 'solid-js/store';
import styles from './gradient-generator.module.css';
import { createContext, createMemo, createUniqueId, type ParentProps, useContext } from 'solid-js';
import { GradientInput } from './gradient-input.tsx';

export type GradientDefinition = { color: Color, id: string; stop: number };
export type GradientDefinitions = GradientDefinition[];

type GradientStore = {
  gradientDefinitions: GradientDefinitions;
  gradientType: GradientType;
}

export type GradientType = 'linear' | 'radial' | 'conic';

export const GradientContext = createContext<{
  positionStop: (id: string, stop: number) => void;
  insertStop: (stop: number, color: Color) => string;
  sortedGradientDefinitions: () => GradientDefinition[];
  state: GradientStore
}>();

export const useGradientContext = () => useContext(GradientContext)!;

export const GradientGenerator = () => {
  const [state, setState] = createStore<GradientStore>({
    gradientDefinitions: [
      { color: Color.fromHsl(174, 100, 50), stop: 0 },
      { color: Color.fromHsl(280, 100, 50), stop: .5 },
      { color: Color.fromHsl(212, 100, 50), stop: 1 },
    ].map((def) => ({...def, id: createUniqueId() })),
    gradientType: 'linear'
  });

  const positionStop = (id: string, stop: number) => {
    const stopIndex = state.gradientDefinitions.findIndex((def) => def.id === id);
    const updatedStop = { ...state.gradientDefinitions[stopIndex] }!;
    updatedStop.stop = stop || updatedStop.stop;
    setState('gradientDefinitions', state.gradientDefinitions.with(stopIndex, updatedStop));
  }

  const insertStop = (stop: number, color: Color) => {
    const id = createUniqueId();
    setState('gradientDefinitions', [...state.gradientDefinitions, { stop, color, id}]);
    return id;
  }

  const sortedGradientDefinitions = createMemo(() => [...state.gradientDefinitions].sort((a, b) => a.stop - b.stop));

  const Provider = (props: ParentProps) =>
    <GradientContext.Provider value={{ state, insertStop, positionStop, sortedGradientDefinitions }}>{props.children}</GradientContext.Provider>;

  return <div class={styles['gradient-generator']}>
    <Provider>
      <GradientPreview/>
      <GradientInput/>
    </Provider>
  </div>;
}
