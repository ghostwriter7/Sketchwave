import { useGlobalContext } from '../../../global-provider.tsx';
import './line-thickness-picker.css';
import { createEffect, createSignal, Show } from 'solid-js';
import { ThemeHelper } from '../../../utils/ThemeHelper.ts';
import { Icon } from '../../icon/icon.tsx';
import { Color } from '../../../types/Color.ts';

export const LineThicknessPicker = () => {
  const { state, updateState } = useGlobalContext();
  const [showPreview, setShowPreview] = createSignal(false)

  const handleWidthChange = (event: Event): void => {
    const { value } = event.target as HTMLInputElement;
    updateState({ size: parseInt(value, 10) });
  }

  const toggleSizePreview = () => {
    setShowPreview(!showPreview());
  }

  const previewCanvas = <canvas class="preview-canvas" width="120" height="120"></canvas> as HTMLCanvasElement;
  const ctx = previewCanvas.getContext('2d')!;

  createEffect(() => {
    const width = state.size;
    ctx.fillStyle = ThemeHelper.getColor('clr-accent');
    ctx.roundRect(0, 0, previewCanvas.width, previewCanvas.height);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = ThemeHelper.getColor('bg-secondary');
    ctx.fillRect(2, 2, previewCanvas.width - 4, previewCanvas.height - 4);
    ctx.fillStyle = new Color(...state.color, state.alpha).toString();
    ctx.arc(60, 60, width / 2, 0, 2 * Math.PI);
    ctx.fill();
  });

  return <>
    <div class="line-thickness" title="Line Thickness (T)">
      <Icon icon="line_weight" />
      <input
        id="line-thickness-picker"
        type="range"
        step="1"
        value={state.size}
        max={100}
        min={1}
        onFocusIn={toggleSizePreview}
        onFocusOut={toggleSizePreview}
        onInput={handleWidthChange}/>
      <span class="current-width">{state.size}px</span>
      <Show when={showPreview()}>{previewCanvas}</Show>
    </div>
  </>
}

