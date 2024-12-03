import { createContext, type ParentProps, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { ShapeType, ToolType } from './types/core.type.ts';
import { type LayerFacade } from './render/LayerFacade.ts';

export interface ToolProperties {
  isRounded?: boolean;
  shapeType?: ShapeType;
}

export interface GlobalContextState {
  activeTool?: ToolType;
  color: [number, number, number];
  ctx: CanvasRenderingContext2D | null;
  currentMouseX: number | null;
  currentMouseY: number | null;
  height: number;
  layerFacade: LayerFacade | null;
  scale: number;
  size: number;
  width: number;
  toolProperties?: ToolProperties;
}

interface GlobalContextActions {
  setCtx(ctx: CanvasRenderingContext2D): void;
  setDimensions(width: number, height: number): void;
  setLayerFacade(layerFacade: LayerFacade): void;
  setMousePos<T extends number | null>(x: T, y: T): void;
  setScale(scale: number): void;
  state: GlobalContextState;
  updateState: (state: Partial<GlobalContextState>) => void;
}

const GlobalContext = createContext<GlobalContextActions>();

export const GlobalProvider = (props: ParentProps) => {
  const [state, setState] = createStore<GlobalContextState>({
    color: [0, 0, 0],
    ctx: null,
    currentMouseX: null,
    currentMouseY: null,
    height: innerHeight * 0.7,
    layerFacade: null,
    scale: 1,
    size: 1,
    width: innerWidth * 0.8
  });

  const facade: GlobalContextActions = {
    state,
    setCtx: (ctx: CanvasRenderingContext2D) => setState('ctx', ctx),
    setLayerFacade: (layerFacade: LayerFacade) => setState('layerFacade', layerFacade),
    setMousePos: <T extends number | null>(x: T, y: T) => setState({ currentMouseX: x, currentMouseY: y }),
    setDimensions: (width: number, height: number) => setState({ width, height }),
    setScale: (scale: number) => setState({ scale }),
    updateState: (state: Partial<GlobalContextState>) => setState({ ...state }),
  }

  return <GlobalContext.Provider value={{ ...facade }}>{props.children}</GlobalContext.Provider>
}

export const useGlobalContext = (): GlobalContextActions => useContext(GlobalContext)!;
