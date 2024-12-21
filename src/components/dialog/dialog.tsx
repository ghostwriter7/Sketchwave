import { onMount, type ParentProps, Show } from 'solid-js';
import styles from './dialog.module.css';
import { Icon } from '../icon/icon.tsx';

export type DialogApi = {
  close: () => void;
  open: () => void;
}

export const Dialog = (props: ParentProps<{
  setRef: (ref: { close: () => void; open: () => void }) => void;
  title?: string;
}>) => {
  let dialogRef!: HTMLDialogElement;

  onMount(() => {
    props.setRef({
      close: () => dialogRef.close(),
      open: () => dialogRef.showModal()
    });
  });

  const handleClick = ({ clientX, clientY }: MouseEvent) => {
    const { left, right, top, bottom } = dialogRef.getBoundingClientRect();
    if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
      dialogRef.close();
    }
  }

  return <dialog class={styles.dialog} ref={dialogRef} onClick={handleClick}>
    <button class={styles.closeButton} onClick={() => dialogRef.close()}>
      <Icon icon="close"/>
    </button>
    <Show when={props.title}>
      <div>
        <h3 class={styles.title}>{props.title}</h3>
      </div>
    </Show>
    <div class={`${styles.body} scroller`}>
      {props.children}
    </div>
  </dialog>
}
