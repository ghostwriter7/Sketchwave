import { ToolHandler } from '../abstract/ToolHandler.ts';
import type { ToolState } from '../models/ToolState.ts';
import { type LayerFacade } from '../../LayerFacade.ts';
import { ShapeAdjuster } from '../resizer/ShapeAdjuster.ts';
import { Point } from '../../../types/Point.ts';
import { FileHelper } from '../../../utils/FileHelper.ts';
import { ImageBitmapHelper } from '../../../utils/ImageBitmapHelper.ts';

export class ImportImage extends ToolHandler {
  private imageBitmap?: ImageBitmap;
  private startPoint?: Point;
  private endPoint?: Point;
  private rotateAngleInRadians?: number;
  private shapeAdjuster?: ShapeAdjuster;

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }

  public override onDestroy(): void {
    super.onDestroy();
    this.shapeAdjuster?.destroy();
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

  public tryCreateLayer(): void {
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

  protected initializeListeners(): void {
  }

  private handleShapeAdjustment(origin: Point, width: number, height: number, angle: number): void {
    this.startPoint = origin;
    this.endPoint = new Point(origin.x + width, origin.y + height);
    this.rotateAngleInRadians = angle;
    this.ctx.rotateCanvas( Point.midPoint(this.startPoint, this.endPoint), angle);
    this.renderPreview();
  }

  private async promptUserForFileAndProcess(): Promise<void> {
    try {
      this.imageBitmap = await FileHelper.tryGetImageBitmap();

      if (this.width < this.imageBitmap.width || this.height < this.imageBitmap.height) {
        this.imageBitmap = await ImageBitmapHelper.scaleImageBitmapToFitDimensions(this.imageBitmap, this.width * .9, this.height * .9);
      }

      this.shapeAdjuster = new ShapeAdjuster(
        this.width,
        this.height,
        this.layerFacade.ctx.canvas,
        this.handleShapeAdjustment.bind(this),
        () => {
          this.shapeAdjuster?.destroy();
          this.deactivate();
        },
        30
      );

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
}
