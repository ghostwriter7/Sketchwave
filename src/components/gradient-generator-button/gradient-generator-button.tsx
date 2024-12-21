import { Icon } from '../icon/icon.tsx';
import { Dialog, type DialogApi } from '../dialog/dialog.tsx';
import { GradientGenerator } from '../gradient-generator/gradient-generator.tsx';

export const GradientGeneratorButton = () => {
  let dialogApi!: DialogApi;

  return <>
    <button id="gradient-generator-button" onClick={() => dialogApi.open()}>
      <Icon icon="gradient"/>
    </button>
    <Dialog
      title="Gradient Generator"
      setRef={(ref) => dialogApi = ref}>
      <GradientGenerator />
    </Dialog>
  </>
}
