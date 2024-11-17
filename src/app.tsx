import Canvas from './canvas.tsx';
import Menu from './ui/menu/menu.tsx';
import { GlobalProvider } from './global-provider.tsx';

const App = () => {
  return <>
    <GlobalProvider>
      <Menu />
      <main>
        <Canvas/>
      </main>
    </GlobalProvider>
  </>;
}

export default App;
