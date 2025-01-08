import { A } from '@solidjs/router';
import styles from './home.module.css';
import { For } from 'solid-js';

const Home = () => {
  const menuOptions = [
    { uri: '/painter', label: 'SketchWave' },
    { uri: '/juggling', label: 'Juggling' },
  ]
  return <div class={styles.home}>
    <For each={menuOptions}>
      {({ uri, label }) =>
        <A class={styles.card} href={uri}>{label}</A>}
    </For>
  </div>
}

export default Home;
