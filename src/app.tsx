import Canvas from './components/canvas/canvas.tsx';
import Menu from './components/menu/menu.tsx';
import { GlobalProvider } from './global-provider.tsx';
import { CanvasSummary } from './components/canvas-summary/canvas-summary.tsx';
import { LineThicknessPicker } from './components/tools/line-thickness-picker/line-thickness-picker.tsx';

const App = () => {
  const KEYBOARD_MAPPING = {
    'brushes-picker': 'KeyB',
    eraser: 'KeyE',
    rect: 'KeyR',
    line: 'KeyL',
    'color-picker-button': 'KeyC',
    'line-thickness-picker': 'KeyT',
    'undo': { key: 'KeyZ', ctrl: true },
    'redo': { key: 'KeyY', ctrl: true },
    'save-file-button': { key: 'KeyS', ctrl: true },
    'open-file-button': { key: 'KeyO', ctrl: true }
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
      event.preventDefault();
      const element = document.getElementById(matchingActionKey) || document.querySelector(`[data-tool="${matchingActionKey}"]`);
      element?.click();
      element?.focus();
    }
  });

  return <>
    <GlobalProvider>
      <Menu/>
      <main>
        <LineThicknessPicker/>
        <Canvas/>
      </main>
      <CanvasSummary/>
    </GlobalProvider>
  </>;
}

export default App;
