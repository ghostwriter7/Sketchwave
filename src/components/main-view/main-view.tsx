import { LineThicknessPicker } from '../tools/line-thickness-picker/line-thickness-picker.tsx';
import Canvas from '../canvas/canvas.tsx';
import './main-view.css';
import { useGlobalContext } from '../../global-provider.tsx';
import { createEffect } from 'solid-js';

export const MainView = () => {
  const { state } = useGlobalContext();
  let wrapperRef!: HTMLDivElement;
  let mainRef!: HTMLElement;

  createEffect(() => {
    state.scale;
    const canvas = document.querySelector('.canvas') as HTMLCanvasElement;

    if (canvas) {
      const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();
      const { width: mainWidth, height: mainHeight } = wrapperRef.getBoundingClientRect();

      const showHorizontalScrollbar = canvasWidth > mainWidth;
      const showVerticalScrollbar = canvasHeight > mainHeight;

      wrapperRef.style.width = showHorizontalScrollbar ? `${canvasWidth}px` : '100%';
      wrapperRef.style.height = showVerticalScrollbar ? `${canvasHeight}px` : '100%';

      mainRef.style.overflowX = showHorizontalScrollbar ? 'scroll' : 'hidden';
      mainRef.style.overflowY = showVerticalScrollbar ? 'scroll' : 'hidden';

      if (!showVerticalScrollbar && !showVerticalScrollbar) {
        mainRef.scrollTop = 0;
      }
    }
  });


  return <main class="scroller" ref={mainRef!}>
    <LineThicknessPicker/>
    <div class="canvas-wrapper" ref={wrapperRef!}>
      <Canvas/>
    </div>
  </main>
}
