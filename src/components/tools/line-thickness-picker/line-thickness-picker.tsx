import { useGlobalContext } from '../../../global-provider.tsx';
import './line-thickness-picker.css';

export const LineThicknessPicker = () => {
  const { state, updateState } = useGlobalContext();

  const handleWidthChange = (event: Event): void => {
    const { value } = event.target as HTMLInputElement;
    updateState({ lineWidth: parseInt(value, 10) });
  }


  return <>
    <div class="line-thickness" title="Line Thickness (T)">
      <span class="material-symbols-outlined">line_weight</span>
      <input
        id="line-thickness-picker"
        type="range"
        step="1"
        value={state.lineWidth}
        max={100}
        min={1}
        onInput={handleWidthChange}/>
      <span class="current-width">{state.lineWidth}px</span>
    </div>
  </>
}

