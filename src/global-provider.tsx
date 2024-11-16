import { batch, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { Coordinates, Layer } from './types/core.type.ts';
import type { Tool } from './handlers/tool-handler.type.ts';

interface GlobalContextState {
  activeTool?: Tool;
  clicks: Coordinates[];
  color: [number, number, number];
  layers: Layer[];
  mousePosition?: Coordinates;
  tempLayer?: Layer;
}

interface GlobalContextActions {
  addClick: (x: number, y: number) => void;
  setMousePosition: (x: number, y: number) => void;
  setActiveTool: (activeTool: 'rect' | 'triangle' | 'circle') => void;
  setColor: (color: [number, number, number]) => void;
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
    color: [number, number, number];
    clicks: Coordinates[];
    layers: Layer[];
    mousePosition?: Coordinates;
    tempLayer?: Layer;
  }>({
    clicks: [],
    color: [0, 0, 0],
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
  const setColor = (color: [number, number, number]) => setState({ color });

  const layerFacade = {
    insertLayer,
    removeLayer,
    resetCoordinates,
    setTemporaryLayer,
  }

  return (
    <GlobalContext.Provider
      value={{ addClick, layerFacade, setColor, setActiveTool, setMousePosition, state }}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = (): GlobalContextActions => useContext(GlobalContext)!;
