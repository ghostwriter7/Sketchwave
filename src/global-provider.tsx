import { createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { ToolType } from './types/core.type.ts';

interface GlobalContextState {
  activeTool?: ToolType;
  color: [number, number, number];
}

interface GlobalContextActions {
  setActiveTool: (activeTool: ToolType) => void;
  setColor: (color: [number, number, number]) => void;
  state: GlobalContextState;
}

const GlobalContext = createContext<GlobalContextState & GlobalContextActions>();

export const GlobalProvider = (props) => {
  const [state, setState] = createStore<GlobalContextState>({ color: [0, 0, 0] });
  const setActiveTool = (activeTool: ToolType) => setState({ activeTool });
  const setColor = (color: [number, number, number]) => setState({ color });


  return (
    <GlobalContext.Provider
      value={{ setColor, setActiveTool, state }}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = (): GlobalContextActions => useContext(GlobalContext)!;
