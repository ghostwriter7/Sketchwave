import { ToolHandler } from './ToolHandler.ts';
import type { ToolState } from './ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { useGlobalContext } from '../../global-provider.tsx';

export class ImageTool extends ToolHandler {
  private imageBitmap: ImageBitmap | null = null;
  private updatedWidth: number | null = null;
  private updatedHeight: number | null = null;

  constructor(ctx: CanvasRenderingContext2D, toolState: ToolState, layerFacade: LayerFacade) {
    super(ctx, toolState, layerFacade);
  }

  public override onDestroy(): void {
    this.logger.log('Destroying an instance.');
  }

  public override async onInit(): Promise<void> {
    this.logger.log('Initializing.');
    const { updateState } = useGlobalContext();

    this.imageBitmap = await this.tryGetImageBitmap();

    if (this.imageBitmap && this.canProceed()) {
      if (this.layerFacade.hasAnyLayers()) this.layerFacade.clearLayers();

      const { width, height } = this.imageBitmap;
      this.updatedWidth = width;
      this.updatedHeight = height;
      const [maxWidth, maxHeight] = [innerWidth - 150, innerHeight - 150];

      if (width > maxWidth || height > maxHeight) {
        const scaleFactor = Math.min(maxWidth / width, maxHeight / height);
        this.updatedWidth = width * scaleFactor;
        this.updatedHeight = height * scaleFactor;
        updateState({ width: this.updatedWidth, height: this.updatedHeight });
      } else {
        updateState({ width, height });
      }

      this.tryCreateLayer();
      this.layerFacade.renderLayers();
    }
    updateState({ activeTool: undefined });
  }

  public tryCreateLayer(): void {
    if (!this.imageBitmap) return;

    const imageBitmap = this.imageBitmap;
    this.layerFacade.pushLayer({
      tool: this.name,
      draw: (ctx: CanvasRenderingContext2D) =>
        ctx.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height, 0, 0,
          this.updatedWidth!,
          this.updatedHeight!)
    });

    this.imageBitmap = null;
  }

  private canProceed(): boolean {
    return !this.layerFacade.hasAnyLayers() || confirm('You have unsaved changes. Your current state will be lost. Do you want to continue?');
  }

  private async tryGetImageBitmap(): Promise<ImageBitmap | null> {
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
        this.logger.warn(message);
      } else {
        console.error(error);
      }

      return null;
    }
  }
}
