import { useGlobalContext } from '../../global-provider.tsx';
import './menu.css';
import type { ToolType } from '../../types/core.type.ts';
import { Logger } from '../../utils/Logger.ts';
import { LineThicknessPicker } from '../tools/line-thickness-picker/line-thickness-picker.tsx';
import { ColorPicker } from '../tools/color-picker/color-picker.tsx';
import { For } from 'solid-js';
import { SaveButton } from '../save-button/save-button.tsx';
import { OpenFileButton } from '../open-file-button/open-file-button.tsx';
import { FullScreenButton } from '../full-screen-button/full-screen-button.tsx';
import { BrushPicker } from '../brush-picker/brush-picker.tsx';

const KEYBOARD_MAPPING = {
  'brushes-picker': 'KeyB',
  eraser: 'KeyE',
  rect: 'KeyR',
  line: 'KeyL',
  'color-picker-button': 'KeyC',
  'line-thickness-picker': 'KeyT',
  'save-file-button': { key: 'KeyS', ctrl: true },
  'open-file-button': { key: 'KeyO', ctrl: true }
}

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

  document.addEventListener('keydown', (event) => {
    const { code, ctrlKey } = event;
    const matchingActionKey = Object.entries(KEYBOARD_MAPPING).find(([_, value]) => {
      if (typeof value === 'string') {
        return code === value && !ctrlKey;
      }
      return value.key === code && (!value.ctrl || ctrlKey);
    })?.[0];

    if (matchingActionKey) {
      event.preventDefault();

      if (buttons.some((button) => button.id === matchingActionKey)) {
        updateState({ activeTool: matchingActionKey as ToolType });
      } else {
        const element = document.getElementById(matchingActionKey);
        element?.click();
        element?.focus();
      }
    }
  });

  return <nav class="menu" onClick={handleClick}>
    <SaveButton/>
    <OpenFileButton/>
    <For each={buttons}>
      {({ id, icon, title }) =>
        <button classList={{ active: state.activeTool === id }} data-tool={id} title={title}>
          <span class="material-symbols-outlined">{icon}</span>
        </button>}
    </For>
    <BrushPicker />
    <LineThicknessPicker/>
    <ColorPicker/>
    <FullScreenButton/>
  </nav>
}

export default Menu;
