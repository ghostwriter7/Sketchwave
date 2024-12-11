import { createContext, type ParentProps, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { RGB, ShapeType, ToolType } from './types/core.type.ts';
import { type LayerFacade } from './render/LayerFacade.ts';

export interface ToolProperties {
  round?: boolean;
  stroke?: boolean;
  fill?: boolean;
  shapeType?: ShapeType;
}

export type GlobalContextState = {
  activeTool?: ToolType;
  alpha: number;
  color: RGB;
  ctx: CanvasRenderingContext2D | null;
  currentMouseX: number | null;
  currentMouseY: number | null;
  height: number;
  layerFacade: LayerFacade | null;
  scale: number;
  size: number;
  width: number;
  toolProperties?: ToolProperties;
} & Partial<Pick<CanvasRenderingContext2D, 'lineCap' | 'lineJoin'>>

interface GlobalContextActions {
  setAlpha(alpha: number): void;
  setActiveTool(tool?: ToolType): void;
  setColor(color: RGB): void;
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
    alpha: 1,
    color: [0, 0, 0],
    ctx: null,
    currentMouseX: null,
    currentMouseY: null,
    height: innerHeight * 0.7,
    layerFacade: null,
    scale: 1,
    size: 3,
    width: innerWidth * 0.8
  });

  const facade: GlobalContextActions = {
    state,
    setAlpha: (alpha: number) => setState('alpha', alpha),
    setActiveTool: (tool?: ToolType) => setState('activeTool', tool),
    setColor: (color: RGB) => setState('color', color),
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
