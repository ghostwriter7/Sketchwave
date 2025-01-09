import { useGlobalContext } from '../../global-provider.tsx';
import styles from './menu.module.css';
import type { ToolType } from '../../types/core.type.ts';
import { Logger } from '../../utils/Logger.ts';
import type { ParentProps } from 'solid-js';

const Menu = (props: ParentProps) => {
  const logger = new Logger('Menu');
  const { state, setActiveTool } = useGlobalContext();

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
    {props.children}
  </nav>
}

export default Menu;
