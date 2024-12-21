import { GradientPreview } from './gradient-preview.tsx';
import { Color } from '../../types/Color.ts';
import { createStore } from 'solid-js/store';
import styles from './gradient-generator.module.css';
import { type Accessor, createContext, createMemo, createUniqueId, type ParentProps, useContext } from 'solid-js';
import { GradientInput } from './gradient-input.tsx';
import { StopList } from './stop-list.tsx';
import { GradientStoreManager } from './gradient-store-manager.tsx';

export type GradientDefinition = { color: Color, id: string; stop: number };
export type GradientDefinitions = GradientDefinition[];

export type Gradient = {
  id?: string;
  gradientDefinitions: GradientDefinitions;
  gradientType: GradientType;
}

type GradientStore = {
  activeStopId?: string;
  gradientDefinitions: GradientDefinitions;
  gradientType: GradientType;
  id?: string;
}

export type GradientType = 'linear' | 'radial' | 'conic';

export const GradientContext = createContext<{
  activeStop: Accessor<GradientDefinition>;
  editGradient: (gradient: Gradient) => void;
  setActiveStopId: (stopId: string) => void;
  setStopColor: (id: string, color: Color) => void;
  setGradientId: (id: string) => void;
  positionStop: (id: string, stop: number) => void;
  insertStop: (stop: number, color: Color) => string;
  removeStop: (id: string) => void;
  state: GradientStore
}>();

export const useGradientContext = () => useContext(GradientContext)!;

export const GradientGenerator = () => {
  const [state, setState] = createStore<GradientStore>({
    gradientDefinitions: [
      { color: Color.fromHsl(174, 1, 1), stop: 0 },
      { color: Color.fromHsl(280, 1, 1), stop: .5 },
      { color: Color.fromHsl(212, 1, 1), stop: 1 },
    ].map((def) => ({ ...def, id: createUniqueId() })),
    gradientType: 'linear'
  });

  const setActiveStopId = (id: string) => setState({ activeStopId: id });
  setActiveStopId(state.gradientDefinitions.at(0)!.id);

  const activeStop = createMemo(() => state.gradientDefinitions
    .find(({ id }) => id === state.activeStopId)!);

  const gradientDefinitionsSorter = (a: GradientDefinition, b: GradientDefinition) => a.stop - b.stop;

  const positionStop = (id: string, stop: number) => {
    const stopIndex = state.gradientDefinitions.findIndex((def) => def.id === id);
    const updatedStop = { ...state.gradientDefinitions[stopIndex], stop }!;
    setState('gradientDefinitions', state.gradientDefinitions
      .with(stopIndex, updatedStop)
      .toSorted(gradientDefinitionsSorter));
  }

  const insertStop = (stop: number, color: Color) => {
    const id = createUniqueId();
    setState('gradientDefinitions', [...state.gradientDefinitions, { stop, color, id }]
      .toSorted(gradientDefinitionsSorter));
    return id;
  }

  const setStopColor = (id: string, color: Color) => {
    const stopIndex = state.gradientDefinitions.findIndex((def) => def.id === id);
    const updatedStop = { ...state.gradientDefinitions[stopIndex], color }!;
    setState('gradientDefinitions', state.gradientDefinitions.with(stopIndex, updatedStop));
  }

  const removeStop = (id: string) =>
    setState({
      activeStopId: state.activeStopId === id
        ? state.gradientDefinitions.find((def) => def.id !== id)!.id
        : state.activeStopId,
      gradientDefinitions: state.gradientDefinitions.filter((def) => def.id !== id)
    });

  const editGradient = ({ gradientDefinitions, gradientType, id }: Gradient) => setState({
    activeStopId: gradientDefinitions.at(0)!.id,
    gradientDefinitions,
    gradientType,
    id
  });

  const setGradientId = (id: string) => setState({ id });

  const Provider = (props: ParentProps) =>
    <GradientContext.Provider
      value={{
        state,
        activeStop,
        editGradient,
        setActiveStopId,
        setGradientId,
        insertStop,
        positionStop,
        setStopColor,
        removeStop
      }}>{props.children}</GradientContext.Provider>;

  return <div class={styles.gradientGenerator}>
    <Provider>
      <StopList/>
      <GradientPreview gradient={{ gradientDefinitions: state.gradientDefinitions, gradientType: state.gradientType }}/>
      <GradientInput/>
      <GradientStoreManager/>
    </Provider>
  </div>;
}
