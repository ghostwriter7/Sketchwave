import type { ParentProps } from 'solid-js';

export const Icon = (props: ParentProps<{ icon: string}>) =>
  <span class="material-symbols-outlined">{props.icon}</span>
