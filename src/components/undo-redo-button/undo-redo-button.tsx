import { useGlobalContext } from '../../global-provider.tsx';
import { Show } from 'solid-js';
import { Icon } from '../icon/icon.tsx';

export const UndoRedoButton = () => {
  const { state } = useGlobalContext();

  return <>
    <Show when={state.layerFacade}>
      <button
        disabled={!state.layerFacade?.canUndo()}
        id="undo"
        title="Undo (CTRL + Z)"
        onClick={() => state.layerFacade!.undoLayer()}>
        <Icon icon="undo"/>
      </button>
      <button
        disabled={!state.layerFacade?.canRedo()}
        id="redo"
        title="Redo (CTRL + Y)"
        onClick={() => state.layerFacade!.redoLayer()}>
        <Icon icon="redo"/>
      </button>
    </Show>
  </>
}
