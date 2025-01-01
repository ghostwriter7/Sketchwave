import type { LayerFacade } from '../../render/LayerFacade.ts';

export class ClipboardManager {
  constructor(private readonly layerFacade: LayerFacade) {}

  public initialize(): void {
    document.addEventListener('paste', async ({ clipboardData }: ClipboardEvent) => {
      const item = Array.from(clipboardData!.items).find(({ type }) => type.includes('image'));

      if (item) {
        const file = item.getAsFile()!;
        const imageBitmap = await createImageBitmap(file);

        this.layerFacade.clearLayers();
        this.layerFacade.pushLayer({
          canvasWidth: imageBitmap.width,
          canvasHeight: imageBitmap.height,
          draw: (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) => ctx.drawImage(imageBitmap, 0, 0),
          tool: ClipboardManager.name
        });
        this.layerFacade.renderLayers();
      }
    });

    document.addEventListener('copy', () => {
      this.layerFacade.ctx.canvas.toBlob((blob) => {
        const file = new File([blob!], 'clipboardImage.png', { type: 'image/png' });
        navigator.clipboard.write([new ClipboardItem({ 'image/png': file })]);
      });
    });
  }
}
