import { createSignal, For, lazy, Show, type VoidProps } from 'solid-js';
import Menu from '../menu/menu.tsx';
import styles from './toolbar.module.css';
import { HomeTools } from '../menu/home-tools.tsx';

type ToolbarProps = {
  sections?: string[];
  components?: Record<string, ReturnType<typeof lazy>>
}

export const Toolbar = (props: VoidProps<ToolbarProps>) => {
  const [activeSection, setActiveSection] = createSignal('home');
  const sections = props.sections ?? ['home'];

  return <>
    <Show when={sections.length > 1} fallback={<Menu><HomeTools/></Menu>}>
      <div class={styles.sections}>
        <For each={sections}>
          {(section) => <span
            class={styles.item}
            tabindex={1}
            bool:data-active={activeSection() === section}
            onKeyDown={() => setActiveSection(section)}
            onClick={() => setActiveSection(section)}>{section}</span>}
        </For>
      </div>
      <div>
        <Menu>
          <Show when={activeSection() === 'home'} fallback={(() => {
            const Component = props.components![activeSection()];
            return <Component/>;
          })()}>
            <HomeTools/>
          </Show>
        </Menu>
      </div>
    </Show>
  </>
}
