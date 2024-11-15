import { batch, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { Coordinates, Layer } from './types/core.type.ts';

interface GlobalContextState {
  activeTool?: string;
  clicks: Coordinates[];
  layers: Layer[];
  mousePosition?: Coordinates;
  tempLayer?: Layer;
}

interface GlobalContextActions {
  addClick: (x: number, y: number) => void;
  setMousePosition: (x: number, y: number) => void;
  setActiveTool: (activeTool: 'rect' | 'triangle' | 'circle') => void;
  layerFacade: {
    insertLayer: (layer: Layer) => void;
    removeLayer: (layerId: string) => void;
    resetCoordinates: () => void;
    setTemporaryLayer: (tempLayer: Layer) => void;
  }
  state: GlobalContextState;
}

export type LayerFacade = GlobalContextActions["layerFacade"];

const GlobalContext = createContext<GlobalContextState & GlobalContextActions>();

export const GlobalProvider = (props) => {
  const [state, setState] = createStore<{
    activeTool?: 'rect' | 'triangle' | 'circle';
    clicks: Coordinates[];
    layers: Layer[];
    mousePosition?: Coordinates;
    tempLayer?: Layer;
  }>({
    clicks: [],
    layers: [],
  });
  const addClick = (x: number, y: number) => setState('clicks', (clicks) => [...clicks, [x, y]])
  const setMousePosition = (x: number, y: number) => setState({ mousePosition: [x, y] });
  const resetCoordinates = () => setState({ mousePosition: undefined, clicks: [] });
  const setActiveTool = (activeTool: 'rect' | 'triangle' | 'circle') => setState({ activeTool, clicks: [] });
  const insertLayer = (layer: Layer) => {
    batch(() => {
      setState('layers', (layers) => [...layers, layer]);
      setState({ tempLayer: undefined});
    });
  }
  const removeLayer = (layerId: string) => setState('layers', (layers) => layers.filter((layer) => layer.id !== layerId));
  const setTemporaryLayer = (tempLayer: Layer) => setState({ tempLayer });

  const layerFacade = {
    insertLayer,
    removeLayer,
    resetCoordinates,
    setTemporaryLayer,
  }

  return (
    <GlobalContext.Provider
      value={{ addClick, layerFacade, setActiveTool, setMousePosition, state }}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = (): GlobalContextActions => useContext(GlobalContext)!;
