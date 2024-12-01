import './zoom-in-out.css';
import { useGlobalContext } from '../../global-provider.tsx';

export const ZoomInOut = () => {
  const { state, setScale } = useGlobalContext();

  const handleInput = (event: Event) => {
    const { value } = event.target as HTMLInputElement;
    setScale(parseFloat(value));
  }

  const increaseScale = () => setScale(Math.max(state.scale - .1, .1));
  const decreaseScale = () => setScale(Math.min(state.scale + .1, 4));

  return <div class="zoom-in-out">
    <span class="pointer material-symbols-outlined" classList={{ disabled: state.scale <= 0.1 }} onClick={increaseScale}>zoom_out</span>
    <input type="range" value={state.scale} min={0.1} max={4} step={0.1} onInput={handleInput}/>
    <span class="pointer material-symbols-outlined" classList={{ disabled: state.scale >= 4 }} onClick={decreaseScale}>zoom_in</span>
  </div>
}
