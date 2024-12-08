import './brush-picker.css';
import { For, onMount } from 'solid-js';
import { Card } from '../card/card.tsx';
import { useGlobalContext } from '../../global-provider.tsx';
import { Icon } from '../icon/icon.tsx';
import { BRUSHES } from './brushes.ts';

export const BrushPicker = () => {
  const { state } = useGlobalContext();
  let popoverRef: HTMLElement;

  const handleClick = (event: MouseEvent) => {
    if ((event.target as HTMLElement).getAttribute('data-tool')) {
      popoverRef.hidePopover();
    }
  }

  onMount(() => {
    popoverRef.addEventListener('toggle', (event: Event) => {
      if ((event as ToggleEvent).newState === 'open') {
        (popoverRef.querySelector('button') as HTMLButtonElement).focus();
      }
    });
  });

  return <div class="wrapper">
    <button
      classList={{ active: BRUSHES.some((brush) => brush.id == state.activeTool) }}
      id="brushes-picker"
      popovertarget="brushes"
      title="Brushes (B)">
      <Icon icon="brush" />
    </button>
    <Card ref={popoverRef!} id="brushes" title="Brushes" popover="auto">
      <ul class="dropdown" onClick={handleClick}>
        <For each={BRUSHES}>
          {({ id, label }) =>
            <li>
              <button
                data-tool={id}
                classList={{ active: state.activeTool === id }}
                id={id}>{label}</button>
            </li>}
        </For>
      </ul>
    </Card>
  </div>
}
