import type { ParentProps } from 'solid-js';
import './menu-group.css';

export const MenuGroup = (props: ParentProps<{ label: string}>) =>
  <div class="menu-group">
    <div class="body">{props.children}</div>
    <span class="label">{props.label}</span>
  </div>

