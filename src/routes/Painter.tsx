import Menu from '../components/menu/menu.tsx';
import { MainView } from '../components/main-view/main-view.tsx';
import { CanvasSummary } from '../components/canvas-summary/canvas-summary.tsx';
import { EventService } from '../utils/EventService.ts';
import { useBeforeLeave } from '@solidjs/router';

const Painter = () => {
  const KEYBOARD_MAPPING: Record<string, string | { key: string, ctrl?: boolean; shift?: boolean; }> = {
    newProject: { key: 'KeyN', shift: true },
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

  const eventService = new EventService(KEYBOARD_MAPPING)
  eventService.listen();
  useBeforeLeave(() => eventService.destroy());

  return <>
    <Menu/>
    <MainView/>
    <CanvasSummary/>
  </>
}

export default Painter;
