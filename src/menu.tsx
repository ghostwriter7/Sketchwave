import { useGlobalContext } from './global-provider.tsx';
import { ColorPicker } from './tools/color-picker.tsx';

const Menu = () => {
  const { state, setActiveTool } = useGlobalContext();

  const handleClick = ({ target }: MouseEvent) => {
    const actionId = (target as HTMLButtonElement).id;
    setActiveTool(actionId);
  };

  return <nav onClick={handleClick}>
    <span>Active tool: {state.activeTool}</span>
    <button id="triangleFill">Triangle (fill)</button>
    <button id="triangleStroke">Triangle (stroke)</button>
    <button id="circleFill">Circle (fill)</button>
    <button id="rectFill">Rect (fill)</button>
    <button id="rectStroke">Rect (stroke)</button>
    <button id="rectRound">Rect (round)</button>
    <button popovertarget="line-thickness">Line Thickness</button>
    <button popovertarget="color-picker">Color</button>
    <ColorPicker />
  </nav>
}

export default Menu;
