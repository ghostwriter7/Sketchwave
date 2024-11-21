import { useGlobalContext } from '../../global-provider.tsx';
import { Logger } from '../../utils/Logger.ts';

export const OpenFileButton = () => {
  const { state, setDimensions } = useGlobalContext();
  const logger = new Logger('OpenFileButton');

  const tryGetImageBitmap = async (): Promise<ImageBitmap | null> => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        excludeAcceptAllOption: true,
        multiple: false,
        startIn: 'pictures',
        types: [
          {
            description: 'Images',
            accept: {
              'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
            },
          },
        ],
      });
      const file = await fileHandle.getFile();
      return await createImageBitmap(file);
    } catch (error: unknown) {

      if (error instanceof DOMException) {
        const message = error.name === 'AbortError'
          ? 'User has not selected any image'
          : `Unknown error: ${error.message}`;
        logger.warn(message);
      } else {
        console.error(error);
      }

      return null;
    }
  }

  const ensureNoUnsavedChanges = () => !state.layerFacade!.hasAnyLayers()
    || confirm('You have unsaved changes. Your current state will be lost. Do you want to continue?');

  const handleClick = async () => {

    const imageBitmap = await tryGetImageBitmap();

    if (imageBitmap && ensureNoUnsavedChanges()) {
      if (state.layerFacade!.hasAnyLayers()) state.layerFacade!.clearLayers();

      const { width, height } = imageBitmap;
      let updatedWidth = width;
      let updatedHeight = height;
      const [maxWidth, maxHeight] = [innerWidth - 150, innerHeight - 150];

      if (width > maxWidth || height > maxHeight) {
        const scaleFactor = Math.min(maxWidth / width, maxHeight / height);
        updatedWidth = width * scaleFactor;
        updatedHeight = height * scaleFactor;
        setDimensions(updatedWidth, updatedHeight);
      } else {
        setDimensions(width, height);
      }

      state.layerFacade!.pushLayer({
        tool: 'OpenFileButton',
        draw: (ctx: CanvasRenderingContext2D) =>
          ctx.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height, 0, 0,
            updatedWidth,
            updatedHeight)
      });

      state.layerFacade!.renderLayers();
    }
  }

  return <button onClick={handleClick} title="Open Image (CTRL + O)">
    <span class="material-symbols-outlined">folder_open</span>
  </button>
}
