import type { ParentProps } from 'solid-js';
import "./card.css";

type CardProps = ParentProps<{ title: string; id?: string; popover?: 'auto' | 'manual'}>

export const Card = ({ title, children, ...remaining }: CardProps) => {
  return <>
    <div class="card" {...remaining} >
      <div class="header">
        {title}
      </div>
      <div class="body">
        {children}
      </div>
    </div>
  </>
}
