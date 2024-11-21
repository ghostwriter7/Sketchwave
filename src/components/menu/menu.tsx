import { useGlobalContext } from '../../global-provider.tsx';
import './menu.css';
import type { ToolType } from '../../types/core.type.ts';
import { Logger } from '../../utils/Logger.ts';
import { LineThicknessPicker } from '../tools/line-thickness-picker/line-thickness-picker.tsx';
import { ColorPicker } from '../tools/color-picker/color-picker.tsx';
import { For } from 'solid-js';
import { SaveButton } from '../save-button/save-button.tsx';

const Menu = () => {
  const logger = new Logger('Menu');
  const { state, updateState } = useGlobalContext();

  const buttons: { id: ToolType, icon: string }[] = [
    { id: 'image', icon: 'folder_open' },
    { id: 'rect', icon: 'crop_square' },
    { id: 'line', icon: 'timeline' },
  ]

  const handleClick = ({ target }: MouseEvent) => {
    const element = target as HTMLElement;
    const toolId = element.getAttribute('data-tool') || element.closest('[data-tool]')?.getAttribute('data-tool');

    if (state.activeTool !== toolId && toolId) {
      logger.log(`${toolId.toTitleCase()}Tool selected.`);
      updateState({ activeTool: toolId as ToolType });
    }
  };

  return <nav class="menu" onClick={handleClick}>
    <SaveButton />
    <For each={buttons}>
      {({ id, icon }) => <button data-tool={id}>
        <span class="material-symbols-outlined">{icon}</span>
      </button>}
    </For>
    <LineThicknessPicker/>
    <ColorPicker/>
  </nav>
}

export default Menu;
