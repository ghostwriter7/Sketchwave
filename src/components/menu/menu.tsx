import { useGlobalContext } from '../../global-provider.tsx';
import './menu.css';
import type { ToolType } from '../../types/core.type.ts';
import { Logger } from '../../utils/Logger.ts';
import { ColorPicker } from '../tools/color-picker/color-picker.tsx';
import { For } from 'solid-js';
import { SaveButton } from '../save-button/save-button.tsx';
import { OpenFileButton } from '../open-file-button/open-file-button.tsx';
import { FullScreenButton } from '../full-screen-button/full-screen-button.tsx';
import { BrushPicker } from '../brush-picker/brush-picker.tsx';
import { UndoRedoButton } from '../undo-redo-button/undo-redo-button.tsx';

const Menu = () => {
  const logger = new Logger('Menu');
  const { state, updateState } = useGlobalContext();

  const buttons: { id: ToolType, icon: string; title: string }[] = [
    { id: 'rect', icon: 'crop_square', title: 'Rectangle (R)' },
    { id: 'line', icon: 'timeline', title: 'Line (L)' },
    { id: 'eraser', icon: 'ink_eraser', title: 'Eraser (E)' },
  ];

  const handleClick = ({ target }: MouseEvent) => {
    const element = target as HTMLElement;
    const toolId = element.getAttribute('data-tool') || element.closest('[data-tool]')?.getAttribute('data-tool');

    if (state.activeTool !== toolId && toolId) {
      logger.log(`${toolId.toTitleCase()}Tool selected.`);
      updateState({ activeTool: toolId as ToolType });
    }
  };

  return <nav class="menu" onClick={handleClick}>
    <SaveButton/>
    <OpenFileButton/>
    <UndoRedoButton />
    <For each={buttons}>
      {({ id, icon, title }) =>
        <button classList={{ active: state.activeTool === id }} data-tool={id} title={title}>
          <span class="material-symbols-outlined">{icon}</span>
        </button>}
    </For>
    <BrushPicker />
    <ColorPicker/>
    <FullScreenButton/>
  </nav>
}

export default Menu;
