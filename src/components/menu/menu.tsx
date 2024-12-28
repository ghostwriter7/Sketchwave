import { useGlobalContext } from '../../global-provider.tsx';
import styles from './menu.module.css';
import type { ToolType } from '../../types/core.type.ts';
import { Logger } from '../../utils/Logger.ts';
import { ColorPickerInput } from '../color-picker-input/color-picker-input.tsx';
import { For } from 'solid-js';
import { SaveButton } from '../save-button/save-button.tsx';
import { OpenFileButton } from '../open-file-button/open-file-button.tsx';
import { FullScreenButton } from '../full-screen-button/full-screen-button.tsx';
import { BrushPicker } from '../brush-picker/brush-picker.tsx';
import { UndoRedoButton } from '../undo-redo-button/undo-redo-button.tsx';
import { ShapePicker } from '../shape-picker/shape-picker.tsx';
import { MenuGroup } from './menu-group/menu-group.tsx';
import { Icon } from '../icon/icon.tsx';
import { PickColorButton } from '../pick-color-button/pick-color-button.tsx';
import { ColorShortcuts } from '../color-shortcuts/color-shortcuts.tsx';
import { InstallButton } from '../install-button/install-button.tsx';
import { GradientMenuGroup } from '../gradient-menu-group/gradient-menu-group.tsx';
import { ROTATE_OPTIONS } from './consts/rotate-options.ts';
import { IconDropdown } from '../icon-dropdown/icon-dropdown.tsx';

const Menu = () => {
  const logger = new Logger('Menu');
  const { state, setActiveTool } = useGlobalContext();

  const buttons: { id: ToolType, icon: string; title: string }[] = [
    { id: 'line', icon: 'timeline', title: 'Line (L)' },
    { id: 'eraser', icon: 'ink_eraser', title: 'Eraser (E)' },
    { id: 'fillSpace', icon: 'format_color_fill', title: 'Fill Space (F)' },
    { id: 'importImage', icon: 'add_photo_alternate', title: 'Import Image (CTRL + I)' },
    { id: 'select', icon: 'select_all', title: 'Select' }
  ];

  const getAttributeValue = (element: HTMLElement, name: string): string | null | undefined =>
    element.getAttribute(`data-${name}`) || element.closest(`[data-${name}]`)?.getAttribute(`data-${name}`);

  const handleClick = ({ target }: MouseEvent) => {
    const element = target as HTMLElement;
    const toolId = getAttributeValue(element, 'tool');

    if (state.activeTool !== toolId && toolId) {
      logger.log(`${toolId.toTitleCase()}Tool selected.`);
      setActiveTool(toolId as ToolType);
    }
  };

  return <nav class={`${styles.menu} scroller`} onClick={handleClick}>
    <MenuGroup label="File">
      <div class={styles.grid}>
        <SaveButton/>
        <OpenFileButton/>
        <UndoRedoButton/>
      </div>
    </MenuGroup>
    <span class={styles.divider}></span>
    <MenuGroup label="View">
      <FullScreenButton/>
    </MenuGroup>
    <span class={styles.divider}></span>
    <MenuGroup label="Tools">
      <div class={styles.grid}>
        <For each={buttons}>
          {({ id, icon, title }) =>
            <button classList={{ active: state.activeTool === id }} data-tool={id} title={title}>
              <Icon icon={icon}/>
            </button>}
        </For>
        <PickColorButton/>
        <IconDropdown
          id="rotateButton"
          icon="rotate_left"
          options={ROTATE_OPTIONS}
          onChange={(rotateAction) => setActiveTool(rotateAction as ToolType)}
          title={'Rotate Canvas'}
        />
      </div>
    </MenuGroup>
    <span class={styles.divider}></span>
    <MenuGroup label="Brushes (B)">
      <BrushPicker/>
    </MenuGroup>
    <span class={styles.divider}></span>
    <MenuGroup label="Shapes (S)">
      <ShapePicker/>
    </MenuGroup>
    <span class={styles.divider}></span>
    <MenuGroup label="Colors">
      <ColorPickerInput/>
      <ColorShortcuts/>
    </MenuGroup>
    <span class={styles.divider}></span>
    <GradientMenuGroup/>
    <span class={styles.divider}></span>
    <InstallButton/>
  </nav>
}

export default Menu;
