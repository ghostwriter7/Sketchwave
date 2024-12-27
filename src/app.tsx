import Menu from './components/menu/menu.tsx';
import { CanvasSummary } from './components/canvas-summary/canvas-summary.tsx';
import { MainView } from './components/main-view/main-view.tsx';

const App = () => {
  const KEYBOARD_MAPPING = {
    brushPicker: 'KeyB',
    eraser: 'KeyE',
    fillSpace: 'KeyF',
    rect: 'KeyR',
    line: 'KeyL',
    'color-picker-button': 'KeyC',
    'line-thickness-picker': 'KeyT',
    undo: { key: 'KeyZ', ctrl: true },
    redo: { key: 'KeyY', ctrl: true },
    'save-file-button': { key: 'KeyS', ctrl: true },
    'open-file-button': { key: 'KeyO', ctrl: true },
    pickColor: 'KeyP',
    zoom: 'KeyZ',
    shape: 'KeyS',
    cancel: 'Escape',
    importImage: { key: 'KeyI', ctrl: true },
    'gradient-generator-button': 'KeyG',
  }

  document.addEventListener('keydown', (event) => {
    const { code, ctrlKey } = event;
    const matchingActionKey = Object.entries(KEYBOARD_MAPPING).find(([_, value]) => {
      if (typeof value === 'string') {
        return code === value && !ctrlKey;
      }
      return value.key === code && (!value.ctrl || ctrlKey);
    })?.[0];

    if (matchingActionKey) {
      if (matchingActionKey == 'cancel') {
        (document.activeElement as HTMLElement)?.blur();
      } else {
        event.preventDefault();
        const element = document.getElementById(matchingActionKey) || document.querySelector(`[data-tool="${matchingActionKey}"]`);
        element?.click();
        element?.focus();
      }
    }
  });

  return <>
    <Menu/>
    <MainView/>
    <CanvasSummary/>
  </>;
}

export default App;
