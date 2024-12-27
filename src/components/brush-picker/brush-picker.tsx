import './brush-picker.css';
import { useGlobalContext } from '../../global-provider.tsx';
import { BRUSHES } from './brushes.ts';
import { IconDropdown } from '../icon-dropdown/icon-dropdown.tsx';
import type { ToolType } from '../../types/core.type.ts';

export const BrushPicker = () => {
  const { state, setActiveTool } = useGlobalContext();

  return <div class="wrapper">
    <IconDropdown
      id="brushPicker"
      icon="brush"
      isActive={() => BRUSHES.some(({ value }) => value == state.activeTool)}
      onChange={(value) => setActiveTool(value as ToolType)}
      options={BRUSHES}
      value={state.activeTool}
      title="Brushes (B)"/>
  </div>
}
