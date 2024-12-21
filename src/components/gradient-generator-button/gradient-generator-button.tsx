import { Icon } from '../icon/icon.tsx';
import { Dialog, type DialogApi } from '../dialog/dialog.tsx';

export const GradientGeneratorButton = () => {
  let dialogApi!: DialogApi;

  return <>
    <button onClick={() => dialogApi.open()}>
      <Icon icon="gradient"></Icon>
    </button>
    <Dialog setRef={(ref) => dialogApi = ref}>

    </Dialog>
  </>
}
