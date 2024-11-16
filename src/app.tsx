import Canvas from './canvas.tsx';
import Menu from './menu.tsx';
import { GlobalProvider } from './global-provider.tsx';

const App = () => {
  return <>
    <GlobalProvider>
      <Menu />
      <Canvas/>
    </GlobalProvider>
  </>;
}

export default App;
