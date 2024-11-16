import { useGlobalContext } from '../../global-provider.tsx';
import { ColorPicker } from '../../tools/color-picker/color-picker.tsx';
import { LineThicknessPicker } from '../../tools/line-thickness-picker/line-thickness-picker.tsx';
import './menu.css';

const Menu = () => {
  const { state, setActiveTool } = useGlobalContext();

  const handleClick = ({ target }: MouseEvent) => {
    const element = target as HTMLElement;
    const actionId = element.getAttribute('data-tool') || element.closest('[data-tool]')?.getAttribute('data-tool');
    setActiveTool(actionId);
  };

  return <nav class="menu" onClick={handleClick}>
    <span>Active tool: {state.activeTool}</span>
    <button data-tool="triangleFill">Triangle (fill)</button>
    <button data-tool="triangleStroke">Triangle (stroke)</button>
    <button data-tool="circleFill">Circle (fill)</button>
    <button data-tool="rectFill">Rect (fill)</button>
    <button data-tool="rectStroke">Rect (stroke)</button>
    <button data-tool="rectRound">Rect (round)</button>
    <button data-tool="select"><span class="material-symbols-outlined">ink_selection</span></button>
    <LineThicknessPicker/>
    <ColorPicker/>
  </nav>
}

export default Menu;
