import { createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

const GlobalContext = createContext();

export const GlobalProvider = (props) => {
  const [state, setState] = createStore<{ activeTool?: 'rect' | 'triangle' | 'circle' }>({ activeTool: undefined });
  const setActiveTool = (activeTool: 'rect' | 'triangle' | 'circle') => setState('activeTool', activeTool);

  return (
    <GlobalContext.Provider value={{ state, setActiveTool }}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalContext);
