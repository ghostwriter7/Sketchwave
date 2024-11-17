import { createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { Tool } from './handlers/tool-handler.type.ts';

interface GlobalContextState {
  activeTool?: Tool;
  color: [number, number, number];
}

interface GlobalContextActions {
  setActiveTool: (activeTool: 'rect' | 'triangle' | 'circle') => void;
  setColor: (color: [number, number, number]) => void;
  state: GlobalContextState;
}

const GlobalContext = createContext<GlobalContextState & GlobalContextActions>();

export const GlobalProvider = (props) => {
  const [state, setState] = createStore<{
    activeTool?: 'rect' | 'triangle' | 'circle';
    color: [number, number, number];
  }>({
    color: [0, 0, 0],
  });
  const setActiveTool = (activeTool: 'rect' | 'triangle' | 'circle') => setState({ activeTool });
  const setColor = (color: [number, number, number]) => setState({ color });


  return (
    <GlobalContext.Provider
      value={{ setColor, setActiveTool, state }}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = (): GlobalContextActions => useContext(GlobalContext)!;
