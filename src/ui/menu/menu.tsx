import { useGlobalContext } from '../../global-provider.tsx';
import { ColorPicker } from '../../tools/color-picker/color-picker.tsx';
import { LineThicknessPicker } from '../../tools/line-thickness-picker/line-thickness-picker.tsx';
import './menu.css';
import type { ToolType } from '../../types/core.type.ts';
import { Logger } from '../../utils/Logger.ts';

const Menu = () => {
  const logger = new Logger('MENU');
  const { state, updateState } = useGlobalContext();

  const handleClick = ({ target }: MouseEvent) => {
    const element = target as HTMLElement;
    const toolId = element.getAttribute('data-tool') || element.closest('[data-tool]')?.getAttribute('data-tool');

    if (state.activeTool !== toolId && toolId) {
      logger.log(`${toolId.toUpperCase()} tool selected.`);
      updateState({ activeTool: toolId as ToolType });
    }
  };

  return <nav class="menu" onClick={handleClick}>
    <button data-tool="rect">
      <span class="material-symbols-outlined">crop_square</span>
    </button>
    <button data-tool="line">
      <span class="material-symbols-outlined">timeline</span>
    </button>
    <LineThicknessPicker/>
    <ColorPicker/>
  </nav>
}

export default Menu;
