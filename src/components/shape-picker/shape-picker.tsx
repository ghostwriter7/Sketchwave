import { createEffect, For } from 'solid-js';
import { type AppearanceType, type ArcType, useGlobalContext } from '../../global-provider.tsx';
import type { ShapeType } from '../../types/core.type.ts';
import './shape-picker.css';
import { createStore } from 'solid-js/store';
import { SHAPES } from './shapes.ts';
import { Icon } from '../icon/icon.tsx';
import { Select, type SelectProps } from '../form-controls/select/select.tsx';

type ShapePickerState = {
  arc: ArcType;
  fill: AppearanceType;
  outline: AppearanceType;
  shape: ShapeType | null;
};

export const ShapePicker = () => {
  const { state, updateState } = useGlobalContext();
  const [shapePickerState, setShapePickerState] = createStore<ShapePickerState>({
    arc: 'sharp',
    fill: 'solid',
    outline: 'transparent',
    shape: null
  });

  const roundedDisabledForShapes: ShapeType[] = ['person', 'notifications', 'heart', 'halfMoon', 'circle'];

  const commonOptions = [
    {
      value: 'transparent',
      label: 'Transparent'
    },
    {
      value: 'solid',
      label: 'Solid'
    },
  ];

  const baseGradientOption = { value: 'gradient', label: 'Gradient' };

  const setValueAndValidate = (value: AppearanceType, thisName: 'fill' | 'outline', siblingName: 'fill' | 'outline') => {
    const isTransparent = value === 'transparent';
    const isSiblingTransparent = shapePickerState[siblingName] === 'transparent';
    setShapePickerState({
      [thisName]: value as AppearanceType,
      [siblingName]: isTransparent && isSiblingTransparent ? 'solid' : shapePickerState[siblingName]
    });
  }

  const selects: SelectProps[] = [
    {
      value: () => shapePickerState.fill,
      onChange: (value) => setValueAndValidate(value as AppearanceType, 'fill', 'outline'),
      label: 'Fill',
      options: [
        ...commonOptions,
        {
          disabled: () => !state.fillGradientId,
          ...baseGradientOption
        }
      ]
    },
    {
      value: () => shapePickerState.outline,
      onChange: (value) => setValueAndValidate(value as AppearanceType, 'outline', 'fill'),
      label: 'Outline',
      options: [
        ...commonOptions,
        {
          disabled: () => !state.outlineGradientId,
          ...baseGradientOption
        }
      ]
    },
    {
      value: () => shapePickerState.arc,
      onChange: (value) => setShapePickerState('arc', value as ArcType),
      label: 'Corners',
      options: [
        {
          value: 'sharp',
          label: 'Sharp'
        },
        {
          disabled: () => shapePickerState.fill && roundedDisabledForShapes.includes(shapePickerState.shape!),
          value: 'round',
          label: 'Round'
        }
      ]
    }
  ];

  createEffect(() => {
    const activeShape = shapePickerState.shape;

    if (activeShape) {
      updateState({
        activeTool: 'shape',
        toolProperties: {
          shapeType: activeShape,
          fill: shapePickerState.fill,
          arc: shapePickerState.arc,
          outline: shapePickerState.outline
        }
      });
    }
  });

  createEffect(() => {
    const activeTool = state.activeTool;
    if (activeTool !== 'shape') {
      setShapePickerState('shape', null);
    } else {
      setShapePickerState('shape', state.toolProperties!.shapeType!);
    }
  });

  return <div class="shape-picker" onClick={(e) => e.stopPropagation()}>
    <div tabindex="0" class="shapes scroller interactive" id="shape">
      <For each={SHAPES}>
        {({ icon, shapeType, title }) =>
          <button
            id={shapeType}
            classList={{ active: shapePickerState.shape == shapeType }}
            onClick={() => setShapePickerState({
              shape: shapeType, arc: roundedDisabledForShapes.includes(shapeType)
                ? 'sharp'
                : shapePickerState.arc
            })}
            title={title}
          >
            <Icon icon={icon}/>
          </button>}
      </For>
    </div>

    <div class="modifiers">
      <For each={selects}>
        {({ label, options, value, onChange }) =>
          <Select
            disabled={() => !shapePickerState.shape}
            label={label}
            options={options}
            value={value}
            onChange={onChange}/>
        }
      </For>
    </div>
  </div>
}
