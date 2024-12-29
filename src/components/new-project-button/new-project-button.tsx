import { Icon } from '../icon/icon.tsx';
import { Dialog, type DialogApi } from '../dialog/dialog.tsx';

export const NewProjectButton = () => {
  let dialogRef!: DialogApi;

  return <>
      <button id="newProject" onClick={() => dialogRef.open()} title="Create New Project (SHIFT + N)">
        <Icon icon="add_box" />
      </button>
    <Dialog setRef={(ref) => dialogRef = ref} title="New Project">

    </Dialog>
  </>
}
