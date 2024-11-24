import { useGlobalContext } from '../../../global-provider.tsx';
import './line-thickness-picker.css';
import { createEffect, createSignal, Show } from 'solid-js';
import { rgbToHex } from '../../../color/rgb-to-hex.ts';

export const LineThicknessPicker = () => {
  const { state, updateState } = useGlobalContext();
  const [showPreview, setShowPreview] = createSignal(false)

  const handleWidthChange = (event: Event): void => {
    const { value } = event.target as HTMLInputElement;
    updateState({ lineWidth: parseInt(value, 10) });
  }

  const toggleSizePreview = () => {
    setShowPreview(!showPreview());
  }

  const previewCanvas = <canvas class="preview-canvas" width="120" height="120"></canvas> as HTMLCanvasElement;
  const ctx = previewCanvas.getContext('2d')!;

  createEffect(() => {
    const width = state.lineWidth;
    ctx.beginPath();
    ctx.fillStyle = '#003A61';
    ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    ctx.fillStyle = rgbToHex(...state.color);
    ctx.arc(60, 60, width / 2, 0, 2 * Math.PI);
    ctx.fill();
  });

  return <>
    <div class="line-thickness" title="Line Thickness (T)">
      <span class="material-symbols-outlined">line_weight</span>
      <input
        id="line-thickness-picker"
        type="range"
        step="1"
        value={state.lineWidth}
        max={100}
        min={1}
        onFocusIn={toggleSizePreview}
        onFocusOut={toggleSizePreview}
        onInput={handleWidthChange}/>
      <span class="current-width">{state.lineWidth}px</span>
      <Show when={showPreview()}>{previewCanvas}</Show>
    </div>
  </>
}

