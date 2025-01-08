import { MainView } from '../components/main-view/main-view.tsx';
import { CanvasSummary } from '../components/canvas-summary/canvas-summary.tsx';
import Menu from '../components/menu/menu.tsx';

const Juggling = () => {

  return <>
    <Menu />
    <MainView/>
    <CanvasSummary/>
  </>
}

export default Juggling;
