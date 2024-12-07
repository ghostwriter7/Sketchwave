import './canvas-summary.css';
import { useGlobalContext } from '../../global-provider.tsx';
import { Show } from 'solid-js';
import { ZoomInOut } from '../zoom-in-out/zoom-in-out.tsx';
import { Icon } from '../icon/icon.tsx';

export const CanvasSummary = () => {
  const { state } = useGlobalContext();
  const width = () => Math.floor(state.width);
  const height = () => Math.floor(state.height);
  return <footer class="canvas-summary">
    <Icon icon="arrow_selector_tool" />
    <Show when={state.currentMouseX}>
      <span>x: {state.currentMouseX}, y: {state.currentMouseY}</span>
    </Show>
    |
    <Icon icon="check_box_outline_blank" />
    <span>{width()} x {height()}px</span>
    <ZoomInOut />
  </footer>
}
