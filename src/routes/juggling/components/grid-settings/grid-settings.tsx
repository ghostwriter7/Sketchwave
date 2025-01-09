import styles from './grid-settings.module.css';

export const GridSettings = () => {

  return <div class={styles.wrapper}>
    <label class={styles.label}>
      Row <input class={`interactive ${styles.input}`} max={8} type="number"/>
    </label>
    <label class={styles.label}>
      Col: <input class={`interactive ${styles.input}`} max={8} type="number"/>
    </label>
    <label class={styles.label}>
      Size: <input class={`interactive ${styles.input}`} max={250} type="number"/>
    </label>
  </div>
}
