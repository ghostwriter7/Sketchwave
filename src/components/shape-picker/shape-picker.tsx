import { createEffect, createSignal } from 'solid-js';
import { useGlobalContext } from '../../global-provider.tsx';

export const ShapePicker = () => {
  const { state, updateState } = useGlobalContext();
  const [rounded, setRounded] = createSignal(false);
  const [shape, setShape] = createSignal<string | null>(null);

  createEffect(() => {
    const isRounded = rounded();
    const activeShape = shape();
    if (activeShape) {
      updateState({ activeTool: 'shape', toolProperties: { shapeType: activeShape, isRounded }});
    }
  });

  createEffect(() => {
    const activeTool = state.activeTool;
    if (activeTool !== 'shape') {
      setShape(null);
    }
  });

  return <div class="shape-picker" onClick={(e) => e.stopPropagation()}>
    <label class="interactive" for="rounded-corners" title="Rounded Corners">
      <span class="material-symbols-outlined">rounded_corner</span>
      <input
        class="hidden"
        type="checkbox"
        id="rounded-corners"
        checked={rounded()}
        onInput={(e) => setRounded(e.target.checked)}/>
    </label>
    <button classList={{ active: shape() == 'rect' }} onClick={() => setShape('rect')}>
      <span class="material-symbols-outlined">crop_square</span>
    </button>
  </div>
}
