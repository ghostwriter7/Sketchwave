import { useGlobalContext } from '../../global-provider.tsx';
import { ColorPicker } from '../../tools/color-picker/color-picker.tsx';
import { LineThicknessPicker } from '../../tools/line-thickness-picker/line-thickness-picker.tsx';
import './menu.css';

const Menu = () => {
  const { state, setActiveTool } = useGlobalContext();

  const handleClick = ({ target }: MouseEvent) => {
    const actionId = (target as HTMLButtonElement).id;
    setActiveTool(actionId);
  };

  return <nav class="menu" onClick={handleClick}>
    <span>Active tool: {state.activeTool}</span>
    <button id="triangleFill">Triangle (fill)</button>
    <button id="triangleStroke">Triangle (stroke)</button>
    <button id="circleFill">Circle (fill)</button>
    <button id="rectFill">Rect (fill)</button>
    <button id="rectStroke">Rect (stroke)</button>
    <button id="rectRound">Rect (round)</button>
    <LineThicknessPicker />
    <ColorPicker />
  </nav>
}

export default Menu;
