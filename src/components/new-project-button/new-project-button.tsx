import { Icon } from '../icon/icon.tsx';
import { Dialog, type DialogApi } from '../dialog/dialog.tsx';
import styles from './new-project-button.module.css';

export const NewProjectButton = () => {
  let dialogRef!: DialogApi;

  return <>
    <button id="newProject" onClick={() => dialogRef.open()} title="Create New Project (SHIFT + N)">
      <Icon icon="add_box"/>
    </button>
    <Dialog setRef={(ref) => dialogRef = ref} title="New Project">
      <div class={styles.content}>
        <form class={styles.form}>
          <label for="projectName">Project Name</label>
          <input id="projectName" type="text" required maxlength="20"/>

          <label for="width">Width (px)</label>
          <input id="width" type="number" min="100" max="5000"/>

          <label for="height">Height (px)</label>
          <input id="height" type="number" min="100" max="5000"/>
        </form>
        <button class={styles.saveButton}>
          <Icon icon="add_box"/>
          Save
        </button>
      </div>
    </Dialog>
  </>
}
