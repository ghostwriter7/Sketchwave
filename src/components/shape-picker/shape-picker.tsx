import { createEffect, createSignal, For } from 'solid-js';
import { useGlobalContext } from '../../global-provider.tsx';
import type { ShapeType } from '../../types/core.type.ts';
import './shape-picker.css';

export const ShapePicker = () => {
  const { state, updateState } = useGlobalContext();
  const [rounded, setRounded] = createSignal(false);
  const [shape, setShape] = createSignal<ShapeType | null>(null);

  const shapes: { icon: string, shapeType: ShapeType; title: string }[] = [
    {
      icon: 'crop_square',
      shapeType: 'rect',
      title: 'Rectangle'
    },
    {
      icon: 'change_history',
      shapeType: 'triangle',
      title: 'Triangle'
    },
    {
      icon: 'star',
      shapeType: 'star',
      title: 'Star'
    }
  ]

  createEffect(() => {
    const isRounded = rounded();
    const activeShape = shape();
    if (activeShape) {
      updateState({ activeTool: 'shape', toolProperties: { shapeType: activeShape, isRounded } });
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
    <div class="shapes">
      <For each={shapes}>
        {({ icon, shapeType, title }) =>
          <button classList={{ active: shape() == shapeType }} onClick={() => setShape(shapeType)} title={title}>
            <span class="material-symbols-outlined">{icon}</span>
          </button>}
      </For>
    </div>
  </div>
}
