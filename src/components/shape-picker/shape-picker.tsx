import { type Accessor, createEffect, createMemo, For } from 'solid-js';
import { useGlobalContext } from '../../global-provider.tsx';
import type { ShapeType } from '../../types/core.type.ts';
import './shape-picker.css';
import { createStore } from 'solid-js/store';
import { SHAPES } from './shapes.ts';

type ShapePickerState = {
  round: boolean;
  stroke: boolean;
  fill: boolean;
  shape: ShapeType | null;
};

type Modifiers = {
  disabled: Accessor<boolean>;
  setter: (value: boolean) => void;
  id: keyof Pick<ShapePickerState, 'round' | 'stroke' | 'fill'>;
  icon: string;
  title: string;
}[];

export const ShapePicker = () => {
  const { state, updateState } = useGlobalContext();
  const [shapePickerState, setShapePickerState] = createStore<ShapePickerState>({
    round: false,
    stroke: false,
    fill: false,
    shape: null
  });

  createEffect((hasBeenFilled) => {
    if (!shapePickerState.shape) return shapePickerState.fill;

    if (!shapePickerState.fill && !shapePickerState.stroke) {

      if (hasBeenFilled) {
        setShapePickerState('stroke', true);
      } else {
        setShapePickerState('fill', true);
        return true;
      }
    }

    return shapePickerState.fill;
  });

  const roundedDisabledForShapes: ShapeType[] = ['person', 'notifications', 'heart', 'halfMoon', 'circle'];
  const isModifierDisabled = createMemo(() => !shapePickerState.shape)
  const isRoundDisabled = createMemo(() => isModifierDisabled() || (shapePickerState.fill && roundedDisabledForShapes.includes(shapePickerState.shape!)));

  const modifiers: Modifiers = [
    {
      disabled: isRoundDisabled,
      setter: (value: boolean) => setShapePickerState('round', value),
      id: 'round',
      icon: 'rounded_corner',
      title: 'Round Corners'
    },
    {
      disabled: isModifierDisabled,
      setter: (value: boolean) => setShapePickerState('stroke', value),
      id: 'stroke',
      icon: 'border_style',
      title: 'Outline Shape'
    },
    {
      disabled: isModifierDisabled,
      setter: (value: boolean) => {
        setShapePickerState({
          fill: value,
        });
        if (isRoundDisabled()) {
          setShapePickerState('round', false);
        }
      },
      id: 'fill',
      icon: 'format_paint',
      title: 'Fill Shape'
    }
  ]

  createEffect(() => {
    const round = shapePickerState.round && !isRoundDisabled();
    const stroke = shapePickerState.stroke;
    const fill = shapePickerState.fill;
    const activeShape = shapePickerState.shape;

    if (activeShape) {
      updateState({
        activeTool: 'shape',
        ...(stroke && {
          lineCap: round ? 'round' : 'square',
          lineJoin: round ? 'round' : 'miter'
        }),
        toolProperties: { shapeType: activeShape, fill, round, stroke }
      });
    }
  });

  createEffect(() => {
    const activeTool = state.activeTool;
    if (activeTool !== 'shape') {
      setShapePickerState('shape', null);
    }
  });

  return <div class="shape-picker" onClick={(e) => e.stopPropagation()}>
    <div tabindex="0" class="shapes scroller interactive" id="shape">
      <For each={SHAPES}>
        {({ icon, shapeType, title }) =>
          <button
            classList={{ active: shapePickerState.shape == shapeType }}
            onClick={() => setShapePickerState('shape', shapeType)}
            title={title}
          >
            <span class="material-symbols-outlined">{icon}</span>
          </button>}
      </For>
    </div>

    <div class="modifiers">
      <For each={modifiers}>
        {({ disabled, id, icon, title, setter }) =>
          <label
            class="interactive"
            for={id}
            tabindex={!disabled?.() ? '0' : '1'}
            title={title}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !disabled?.()) {
                setter(!shapePickerState[id]!);
              }
            }}
          >
            <span class="material-symbols-outlined">{icon}</span>
            <input
              class="hidden"
              type="checkbox"
              disabled={disabled?.()}
              id={id}
              checked={shapePickerState[id]}
              onInput={(e) => setter(e.target.checked)}/>
          </label>}
      </For>
    </div>
  </div>
}
