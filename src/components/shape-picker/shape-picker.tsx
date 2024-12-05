import { createEffect, createMemo, createSignal, For } from 'solid-js';
import { useGlobalContext } from '../../global-provider.tsx';
import type { ShapeType } from '../../types/core.type.ts';
import './shape-picker.css';

export const ShapePicker = () => {
  const { state, updateState } = useGlobalContext();
  const [rounded, setRounded] = createSignal(false);
  const [stroked, setStroked] = createSignal(false);
  const [filled, setFilled] = createSignal(true);
  const [shape, setShape] = createSignal<ShapeType | null>(null);

  createEffect((hasBeenFilled) => {
    const isFilled = filled();

    if (!isFilled && !stroked()) {

      if (hasBeenFilled) {
        setStroked(true);
      } else {
        setFilled(true);
        return true;
      }
    }

    return isFilled;
  });

  const roundedDisabledForShapes: ShapeType[] = ['person', 'notifications', 'heart', 'halfMoon', 'circle'];
  const roundDisabled = createMemo(() => !!shape() && filled() && roundedDisabledForShapes.includes(shape()!));

  const modifiers = [
    {
      disabled: roundDisabled,
      getter: rounded,
      setter: setRounded,
      id: 'round',
      icon: 'rounded_corner',
      title: 'Round Corners'
    },
    {
      getter: stroked,
      setter: setStroked,
      id: 'stroke',
      icon: 'border_style',
      title: 'Outline Shape'
    },
    {
      getter: filled,
      setter: setFilled,
      id: 'fill',
      icon: 'format_paint',
      title: 'Fill Shape'
    }
  ]

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
      icon: 'circle',
      shapeType: 'circle',
      title: 'Circle'
    },
    {
      icon: 'star',
      shapeType: 'star',
      title: 'Star'
    },
    {
      icon: 'diamond',
      shapeType: 'diamond',
      title: 'Diamond'
    },
    {
      icon: 'favorite',
      shapeType: 'heart',
      title: 'Heart'
    },
    {
      icon: 'bolt',
      shapeType: 'bolt',
      title: 'Bolt'
    },
    {
      icon: 'bedtime',
      shapeType: 'halfMoon',
      title: 'Half Moon'
    },
    {
      icon: 'notifications',
      shapeType: 'notifications',
      title: 'Notifications'
    },
    {
      icon: 'done_outline',
      shapeType: 'checkmark',
      title: 'Checkmark'
    },
    {
      icon: 'arrow_left_alt',
      shapeType: 'arrow',
      title: 'Arrow'
    },
    {
      icon: 'person',
      shapeType: 'person',
      title: 'Person'
    }
  ];


  createEffect(() => {
    const round = rounded() && !roundDisabled();
    const stroke = stroked();
    const fill = filled()
    const activeShape = shape();
    
    if (activeShape) {
      updateState({
        activeTool: 'shape',
        ...(stroke && {
          lineCap: round ? 'round': 'square',
          lineJoin: round ? 'round' : 'miter'
        }),
        toolProperties: { shapeType: activeShape, fill, round, stroke } });
    }
  });

  createEffect(() => {
    const activeTool = state.activeTool;
    if (activeTool !== 'shape') {
      setShape(null);
    }
  });

  return <div class="shape-picker" onClick={(e) => e.stopPropagation()}>
    <div class="shapes scroller">
      <For each={shapes}>
        {({ icon, shapeType, title }) =>
          <button classList={{ active: shape() == shapeType }} onClick={() => setShape(shapeType)} title={title}>
            <span class="material-symbols-outlined">{icon}</span>
          </button>}
      </For>
    </div>

    <div class="modifiers">
      <For each={modifiers}>
        {({ disabled, id, icon, title, getter, setter }) =>
          <label class="interactive" for={id} title={title}>
            <span class="material-symbols-outlined">{icon}</span>
            <input
              class="hidden"
              type="checkbox"
              disabled={disabled?.()}
              id={id}
              checked={getter()}
              onInput={(e) => setter(e.target.checked)}/>
          </label>}
      </For>
    </div>
  </div>
}
