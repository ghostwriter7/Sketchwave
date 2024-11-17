import Canvas from './components/canvas/canvas.tsx';
import Menu from './components/menu/menu.tsx';
import { GlobalProvider } from './global-provider.tsx';
import { Resizer } from './components/resizer/resizer.tsx';

const App = () => {
  return <>
    <GlobalProvider>
      <Menu />
      <main>
        <Resizer />
        <Canvas/>
      </main>
    </GlobalProvider>
  </>;
}

export default App;
