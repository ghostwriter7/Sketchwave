import { useGlobalContext } from '../../global-provider.tsx';
import { Show } from 'solid-js';

export const UndoRedoButton = () => {
  const { state } = useGlobalContext();

  return <>
    <Show when={state.layerFacade}>
      <button
        disabled={!state.layerFacade?.canUndo()}
        id="undo"
        title="Undo (CTRL + Z)"
        onClick={() => state.layerFacade!.undoLayer()}>
        <span class="material-symbols-outlined">undo</span>
      </button>
      <button
        disabled={!state.layerFacade?.canRedo()}
        id="redo"
        title="Redo (CTRL + Y)"
        onClick={() => state.layerFacade!.redoLayer()}>
        <span class="material-symbols-outlined">redo</span>
      </button>
    </Show>
  </>
}
