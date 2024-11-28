import { useGlobalContext } from '../../global-provider.tsx';

export const UndoRedoButton = () => {
  const { undo, redo, state } = useGlobalContext();

  return <>
    <button disabled={!state.canUndo} id="undo" title="Undo (CTRL + Z)" onClick={undo}>
      <span class="material-symbols-outlined">undo</span>
    </button>
    <button disabled={!state.canRedo} id="redo" title="Redo (CTRL + Y)" onClick={redo}>
      <span class="material-symbols-outlined">redo</span>
    </button>
  </>
}
