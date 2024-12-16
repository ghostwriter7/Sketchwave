import { createStore } from 'solid-js/store';
import type { RGB, ShapeType, ToolType } from './types/core.type.ts';
import { type LayerFacade } from './render/LayerFacade.ts';
import { Color } from './types/Color.ts';

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
  colorShortcuts: Color[];
  ctx: CanvasRenderingContext2D | null;
  currentMouseX: number | null;
  currentMouseY: number | null;
  height: number;
  layerFacade: LayerFacade | null;
  scale: number;
  size: number;
  resizableDimensions: {
    width: number;
    height: number;
  };
  width: number;
  toolProperties?: ToolProperties;
} & Partial<Pick<CanvasRenderingContext2D, 'lineCap' | 'lineJoin'>>

interface GlobalContextActions {
  setAlpha(alpha: number): void;

  setActiveTool(tool?: ToolType): void;

  setColor(color: Color): void;

  setRGB(color: RGB): void;

  setCtx(ctx: CanvasRenderingContext2D): void;

  setDimensions(width: number, height: number): void;

  setLayerFacade(layerFacade: LayerFacade): void;

  setMousePos<T extends number | null>(x: T, y: T): void;

  setScale(scale: number): void;
  setResizableDimensions(width: number, height: number): void;

  state: GlobalContextState;
  updateState: (state: Partial<GlobalContextState>) => void;
}

const [state, setState] = createStore<GlobalContextState>({
  alpha: 1,
  color: [0, 0, 0],
  colorShortcuts: [
    new Color(102, 0, 0),
    new Color(102, 51, 0),
    new Color(102, 102, 0),
    new Color(51, 102, 0),
    new Color(0, 102, 0),
    new Color(0, 102, 51),
    new Color(0, 102, 102),
    new Color(0, 51, 102),
    new Color(0, 0, 102),
    new Color(51, 0, 102),
    new Color(102, 0, 102),
    new Color(102, 0, 51),
    new Color(32, 32, 32),
    new Color(255, 0, 0),
    new Color(255, 128, 0),
    new Color(255, 255, 0),
    new Color(128, 255, 0),
    new Color(0, 255, 0),
    new Color(0, 255, 128),
    new Color(0, 255, 255),
    new Color(0, 128, 255),
    new Color(0, 0, 255),
    new Color(127, 0, 255),
    new Color(255, 0, 255),
    new Color(255, 0, 127),
    ...new Array(5).fill(0).map(() => new Color(128, 128, 128))
  ],
  ctx: null,
  currentMouseX: null,
  currentMouseY: null,
  height: innerHeight * 0.7,
  layerFacade: null,
  scale: 1,
  size: 3,
  resizableDimensions: {
    height: 0,
    width: 0,
  },
  width: innerWidth * 0.8
});

const facade: GlobalContextActions = {
  state,
  setAlpha: (alpha: number) => setState('alpha', alpha),
  setActiveTool: (tool?: ToolType) => setState('activeTool', tool),
  setColor: (color: Color) => setState({ color: [color.red, color.green, color.blue], alpha: color.alpha }),
  setRGB: (color: RGB) => setState('color', color),
  setCtx: (ctx: CanvasRenderingContext2D) => setState('ctx', ctx),
  setLayerFacade: (layerFacade: LayerFacade) => setState('layerFacade', layerFacade),
  setMousePos: <T extends number | null>(x: T, y: T) => setState({ currentMouseX: x, currentMouseY: y }),
  setDimensions: (width: number, height: number) => setState({ width, height }),
  setScale: (scale: number) => setState({ scale }),
  setResizableDimensions: (width: number, height: number)=> setState({ resizableDimensions: { width, height } }),
  updateState: (state: Partial<GlobalContextState>) => setState({ ...state }),
}

export const useGlobalContext = (): GlobalContextActions => facade;
