import './brush-picker.css';
import { For } from 'solid-js';
import { Card } from '../card/card.tsx';
import { useGlobalContext } from '../../global-provider.tsx';

export const BrushPicker = () => {
  const { state } = useGlobalContext();
  const brushes = [
    {
      // Simple arcs
      'label': 'Brush',
      'id': 'brush'
    },
    {
      // Random dots on a given arc area
      'label': 'Airbrush',
      'id': 'airbrush'
    },
    {
      // Short line at 45 degrees
      'label': 'Calligraphy Brush',
      'id': 'calligraphyBrush'
    },
    {
      // Circle, semi-transparent straps along the brush's hair, runs out of paint
      'label': 'Oil Brush',
      'id': 'oilBrush'
    },
    {
      // Circle, semi-transparent, focus on building layers when drawing on itself
      'label': 'Marker',
      'id': 'marker'
    },
    {
      // Cross, small, small variations in depth between pixels, semi transparent
      'label': 'Natural Pencil',
      'id': 'naturalPencil'
    },
    {
      // Similar to the Oil brush, but much softer, initially fairly bright and decreasing it till gone
      'label': 'Watercolor Brush',
      'id': 'watercolorBrush'
    }
  ]

  let popoverRef: HTMLElement;

  const handleClick = (event: MouseEvent) => {
    if ((event.target as HTMLElement).getAttribute('data-tool')) {
      popoverRef.hidePopover();
    }
  }

  return <div class="wrapper">
    <button
      classList={{ active: brushes.some((brush) => brush.id == state.activeTool) }}
      id="brushes-picker"
      popovertarget="brushes"
      title="Brushes (B)">
      <span class="material-symbols-outlined">brush</span>
    </button>
    <Card ref={popoverRef!} id="brushes" title="Brushes" popover="auto">
      <ul class="dropdown" onClick={handleClick}>
        <For each={brushes}>
          {({ id, label }) =>
            <li data-tool={id} classList={{ active: state.activeTool === id }} id={id}>{label}</li>}
        </For>
      </ul>
    </Card>
  </div>
}
