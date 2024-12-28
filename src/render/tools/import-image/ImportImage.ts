import type { ToolState } from '../models/ToolState.ts';
import { type LayerFacade } from '../../LayerFacade.ts';
import { Point } from '../../../types/Point.ts';
import { FileHelper } from '../../../utils/FileHelper.ts';
import { ImageBitmapHelper } from '../../../utils/ImageBitmapHelper.ts';
import { AdjustableToolHandler } from '../abstract/AdjustableToolHandler.ts';

export class ImportImage extends AdjustableToolHandler {
  private imageBitmap?: ImageBitmap;

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }

  public async onInit(): Promise<void> {
    super.onInit();
    this.promptUserForFileAndProcess();
  }

  protected override renderPreview(): void {
    if (!this.imageBitmap || !this.startPoint || !this.endPoint) return;
    super.renderPreview();
    this.ctx.drawImage(this.imageBitmap, this.startPoint.x, this.startPoint.y, this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y);
  }

  protected tryCreateLayer = () => {
    if (!this.imageBitmap || !this.startPoint || !this.endPoint) return;

    const imageBitmap = this.imageBitmap;
    const startPoint = this.startPoint;
    const endPoint = this.endPoint;

    const { dx, dy } = Point.delta(startPoint, endPoint);
    const angle = this.rotateAngleInRadians;
    const [centerX, centerY] = [startPoint!.x + dx / 2, startPoint!.y + dy / 2];

    this.createLayer((ctx: CanvasRenderingContext2D) => {
      if (angle) {
        ctx.resetTransform();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.translate(-centerX, -centerY);
      }
      ctx.drawImage(imageBitmap, startPoint.x, startPoint.y, endPoint.x - startPoint.x, endPoint.y - startPoint.y);
    });
  }

  private async promptUserForFileAndProcess(): Promise<void> {
    try {
      this.imageBitmap = await FileHelper.tryGetImageBitmap();

      if (this.width < this.imageBitmap.width || this.height < this.imageBitmap.height) {
        this.imageBitmap = await ImageBitmapHelper.scaleImageBitmapToFitDimensions(this.imageBitmap, this.width * .9, this.height * .9);
      }

      this.shapeAdjuster = this.createShapeAdjuster();

      const x = (this.width - this.imageBitmap.width) / 2;
      const y = (this.height - this.imageBitmap.height) / 2;

      this.startPoint = new Point(x, y);
      this.endPoint = new Point(x + this.imageBitmap.width, y + this.imageBitmap.height);

      this.shapeAdjuster.renderBoxBetweenStartAndEndPoints(this.startPoint, this.endPoint);
      this.renderPreview();
    } catch (e) {
      this.logger.warn(e as string);
    }
  }

  protected onComplete(): void {
    this.shapeAdjuster = undefined;
    this.deactivate();
  }
}
