import './canvas-summary.css';
import { useGlobalContext } from '../../global-provider.tsx';
import { Show } from 'solid-js';

export const CanvasSummary = () => {
  const { state } = useGlobalContext();
  const width = () => Math.floor(state.width);
  const height = () => Math.floor(state.height);
  return <footer class="canvas-summary">
    <span class="material-symbols-outlined">arrow_selector_tool</span>
    <Show when={state.currentMouseX}>
      <span>x: {state.currentMouseX}, y: {state.currentMouseY}</span>
    </Show>
    |
    <span class="material-symbols-outlined">check_box_outline_blank</span>
    <span>{width()} x {height()}px</span>
  </footer>
}
