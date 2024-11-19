import { createContext, type ParentProps, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { ToolType } from './types/core.type.ts';

export interface GlobalContextState {
  activeTool?: ToolType;
  color: [number, number, number];
  currentMouseX: number | null;
  currentMouseY: number | null;
  height: number;
  lineWidth: number;
  width: number;
}

interface GlobalContextActions {
  setMousePos<T extends number | null>(x: T, y: T): void;
  state: GlobalContextState;
  updateState: (state: Partial<GlobalContextState>) => void;
}

const GlobalContext = createContext<GlobalContextActions>();

export const GlobalProvider = (props: ParentProps) => {
  const [state, setState] = createStore<GlobalContextState>({
    color: [0, 0, 0],
    currentMouseX: null,
    currentMouseY: null,
    height: 300,
    lineWidth: 1,
    width: 500
  });
  const updateState = (state: Partial<GlobalContextState>) => setState({ ...state });
  const setMousePos = <T extends number | null>(x: T, y: T) => setState({ currentMouseX: x, currentMouseY: y })
  return <GlobalContext.Provider value={{ setMousePos, updateState, state }}>{props.children}</GlobalContext.Provider>
}

export const useGlobalContext = (): GlobalContextActions => useContext(GlobalContext)!;
