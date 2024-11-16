import Canvas from './canvas.tsx';
import Menu from './ui/menu/menu.tsx';
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
