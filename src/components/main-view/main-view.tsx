import { LineThicknessPicker } from '../tools/line-thickness-picker/line-thickness-picker.tsx';
import Canvas from '../canvas/canvas.tsx';
import styles from './main-view.module.css';
import { useGlobalContext } from '../../global-provider.tsx';
import { createEffect, onMount } from 'solid-js';
import { Resizer } from '../resizer/resizer.tsx';

export const MainView = () => {
  const { state, setResizableDimensions } = useGlobalContext();
  let wrapperRef!: HTMLDivElement;
  let scrollerRef!: HTMLDivElement;

  const updateCanvasWrapperDimensions = () => {
    const canvas = state.ctx?.canvas;

    if (canvas) {
      const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();

      wrapperRef.style.width = `${canvasWidth}px`;
      wrapperRef.style.height = `${canvasHeight}px`;

      const { width, height } = scrollerRef.getBoundingClientRect();
      const disableHorizontalScroll = canvasWidth < width;
      const disableVerticalScroll = canvasHeight < height;

      scrollerRef.style.overflowX = disableHorizontalScroll ? 'hidden' : 'auto';
      scrollerRef.style.overflowY = disableVerticalScroll ? 'hidden' : 'auto';

      if (disableHorizontalScroll) scrollerRef.scrollLeft = 0;
      if (disableVerticalScroll) scrollerRef.scrollTop = 0;
    }
  }

  createEffect(() => {
    state.scale;
    state.width;
    state.height;
    updateCanvasWrapperDimensions();
  });

  const updateResizableDimensions = () => {
    const { width, height } = scrollerRef.getBoundingClientRect();
    const padding = 16;
    setResizableDimensions(width - padding, height - padding);
  }

  onMount(() => {
    new ResizeObserver(updateResizableDimensions).observe(scrollerRef);
    addEventListener('resize', () => {
      updateResizableDimensions();
      updateCanvasWrapperDimensions();
    });
  });

  return <main class={styles['main-view']}>
    <LineThicknessPicker/>
    <div class={`${styles['scroller']} scroller`} ref={scrollerRef!}>
      <Resizer/>
      <div class={styles['canvas-wrapper']} ref={wrapperRef!}>
        <Canvas/>
      </div>
    </div>
  </main>
}
