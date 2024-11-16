import Canvas from './canvas.tsx';
import Menu from './menu.tsx';
import { GlobalProvider } from './global-provider.tsx';
import { ColorPicker } from './tools/color-picker.tsx';

const App = () => {
  return <>
    <ColorPicker />
    {/*<GlobalProvider>*/}
    {/*  <Menu />*/}
    {/*  <Canvas/>*/}
    {/*</GlobalProvider>*/}
  </>;
}

export default App;
