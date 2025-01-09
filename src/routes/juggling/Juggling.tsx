import { MainView } from '../../components/main-view/main-view.tsx';
import { CanvasSummary } from '../../components/canvas-summary/canvas-summary.tsx';
import { Toolbar } from '../../components/toolbar/toolbar.tsx';
import { lazy } from 'solid-js';

const Juggling = () => {
  const toolbarComponents = { juggling: lazy(() => import('./components/juggling-tools/juggling-tools')) }

  return <>
    <Toolbar sections={['home', 'juggling']} components={toolbarComponents}/>
    <MainView/>
    <CanvasSummary/>
  </>
}

export default Juggling;
