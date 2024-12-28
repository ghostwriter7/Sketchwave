import { ToolHandler } from './ToolHandler.ts';
import { ShapeAdjuster } from '../resizer/ShapeAdjuster.ts';
import { Point } from '../../../types/Point.ts';
import { ShapeAdjusterBuilder } from '../resizer/ShapeAdjusterBuilder.ts';

export abstract class AdjustableToolHandler extends ToolHandler {
  protected startPoint?: Point;
  protected endPoint?: Point;
  protected rotateAngleInRadians?: number;
  protected shapeAdjuster?: ShapeAdjuster;

  protected MINIMAL_SIZE = 30;

  public override onDestroy(): void {
    super.onDestroy();
    this.shapeAdjuster?.destroy();
  }

  protected createShapeAdjuster(): ShapeAdjuster {
    return new ShapeAdjusterBuilder()
      .insertAt(this.layerFacade.ctx.canvas.parentElement!)
      .setOnChange(this.handleShapeAdjustment.bind(this))
      .setOnComplete(this.onComplete.bind(this))
      .setOnCancel(this.onCancel.bind(this))
      .setMinimalSize(this.MINIMAL_SIZE)
      .setScale(this.scale)
      .setDimensions(this.width, this.height)
      .setStyles({ positionAnchor: '--mainCanvas', top: 'anchor(top)', left: 'anchor(left)' })
      .build();
  }

  protected handleShapeAdjustment(origin: Point, width: number, height: number, angle: number): void {
    this.startPoint = origin;
    this.endPoint = new Point(origin.x + width, origin.y + height);
    this.rotateAngleInRadians = angle;
    this.ctx.rotateCanvas( Point.midPoint(this.startPoint, this.endPoint), angle);
    this.renderPreview();
  }

  protected abstract onComplete(): void;

  protected onCancel(): void {
    this.startPoint = this.endPoint = undefined;
    this.layerFacade.renderLayers();
    this.deactivate();
  }
}
