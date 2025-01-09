import { MenuGroup } from './menu-group/menu-group.tsx';
import styles from './menu.module.css';
import { SaveButton } from '../save-button/save-button.tsx';
import { OpenFileButton } from '../open-file-button/open-file-button.tsx';
import { UndoRedoButton } from '../undo-redo-button/undo-redo-button.tsx';
import { FullScreenButton } from '../full-screen-button/full-screen-button.tsx';
import { For } from 'solid-js';
import { Icon } from '../icon/icon.tsx';
import { PickColorButton } from '../pick-color-button/pick-color-button.tsx';
import { IconDropdown } from '../icon-dropdown/icon-dropdown.tsx';
import { ROTATE_OPTIONS } from './consts/rotate-options.ts';
import type { ToolType } from '../../types/core.type.ts';
import { BrushPicker } from '../brush-picker/brush-picker.tsx';
import { ShapePicker } from '../shape-picker/shape-picker.tsx';
import { ColorPickerInput } from '../color-picker-input/color-picker-input.tsx';
import { ColorShortcuts } from '../color-shortcuts/color-shortcuts.tsx';
import { GradientMenuGroup } from '../gradient-menu-group/gradient-menu-group.tsx';
import { InstallButton } from '../install-button/install-button.tsx';
import { useGlobalContext } from '../../global-provider.tsx';
import { Divider } from './divider.tsx';

export const HomeTools = () => {
  const { state, setActiveTool } = useGlobalContext();

  const buttons: { id: ToolType, icon: string; title: string }[] = [
    { id: 'line', icon: 'timeline', title: 'Line (L)' },
    { id: 'eraser', icon: 'ink_eraser', title: 'Eraser (E)' },
    { id: 'fillSpace', icon: 'format_color_fill', title: 'Fill Space (F)' },
    { id: 'importImage', icon: 'add_photo_alternate', title: 'Import Image (CTRL + I)' },
    { id: 'select', icon: 'select_all', title: 'Select' }
  ];

  return <><MenuGroup label="File">
    <div class={styles.grid}>
      {/*<NewProjectButton />*/}
      <SaveButton/>
      <OpenFileButton/>
      <UndoRedoButton/>
    </div>
  </MenuGroup>
    <Divider/>
    <MenuGroup label="View">
      <FullScreenButton/>
    </MenuGroup>
    <Divider/>
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
    <Divider/>
    <MenuGroup label="Brushes (B)">
      <BrushPicker/>
    </MenuGroup>
    <Divider/>
    <MenuGroup label="Shapes (S)">
      <ShapePicker/>
    </MenuGroup>
    <Divider/>
    <MenuGroup label="Colors">
      <ColorPickerInput/>
      <ColorShortcuts/>
    </MenuGroup>
    <Divider/>
    <GradientMenuGroup/>
    <Divider/>
    <InstallButton/>
  </>
}
