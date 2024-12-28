import type { ToolState } from '../models/ToolState.ts';
import type { LayerFacade } from '../../LayerFacade.ts';
import { AdjustableToolHandler } from '../abstract/AdjustableToolHandler.ts';
import { Point } from '../../../types/Point.ts';
import { ThemeHelper } from '../../../utils/ThemeHelper.ts';

export class SelectTool extends AdjustableToolHandler {
  protected override nativeCursor = 'crosshair';
  protected tryCreateLayer = () => {
    if (!this.startPoint || !this.endPoint) return;

    const [x, y] = this.getOrigin();
    const [dx, dy] = this.getDimensions();
    const angle = this.rotateAngleInRadians!;
    const startPoint = this.startPoint!;
    const endPoint = this.endPoint!;
    const [startX, startY] = this.startPoint;
    const offscreenCanvas = this.offscreenCtx!.canvas;
    const width = this.boxWidth!;
    const height = this.boxHeight!;

    this.createLayer((ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(x, y, dx, dy);
      ctx.rotateCanvas(Point.midPoint(startPoint!, endPoint!), angle);
      ctx.drawImage(offscreenCanvas, startX, startY, width, height);
    });
  }

  private imageData?: ImageData;
  private selectionStartPoint?: Point;
  private selectionEndPoint?: Point;
  private offscreenCtx?: OffscreenCanvasRenderingContext2D;

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }

  protected initializeListeners(): void {
    this.onMove((event) => {
      if (event.buttons !== 1) return;

      const point = Point.fromEvent(event);
      if (!this.selectionStartPoint) {
        this.selectionStartPoint = point;
      } else {
        this.selectionEndPoint = point;
        this.renderPreview();
      }
    });

    this.onMouseUp(() => {
      if (!this.selectionStartPoint) return;
      this.layerFacade.renderLayers();
      this.imageData = this.ctx.getImageData(...this.getOrigin().toArray(), ...this.getDimensions());

      const canvas = new OffscreenCanvas(...this.getDimensions());
      this.offscreenCtx = canvas.getContext('2d')!;
      this.offscreenCtx.putImageData(this.imageData, 0, 0);

      this.shapeAdjuster = this.createShapeAdjuster();

      const [startX, startY] = this.selectionStartPoint;
      const [endX, endY] = this.selectionEndPoint!;
      this.selectionStartPoint = new Point(Math.min(startX, endX), Math.min(startY, endY));
      this.selectionEndPoint = new Point(Math.max(startX, endX), Math.max(startY, endY));

      this.shapeAdjuster.renderBoxBetweenStartAndEndPoints(this.selectionStartPoint!, this.selectionEndPoint!);
    })
  }

  protected renderPreview(): void {
    super.renderPreview();
    if (!this.shapeAdjuster) {
      this.ctx.setLineDash([2, 4]);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = ThemeHelper.getColor('clr-primary');
      this.ctx.strokeRect(...this.getOrigin().toArray(), ...this.getDimensions());
    } else {
      this.ctx.resetTransform();
      this.ctx.clearRect(...this.getOrigin().toArray(), ...this.getDimensions());
      this.rotateCanvas();
      this.ctx.drawImage(this.offscreenCtx!.canvas, ...this.startPoint!.toArray(), this.boxWidth!, this.boxHeight!);
    }
  }

  private getOrigin(): Point {
    const x = Math.min(this.selectionStartPoint!.x, this.selectionEndPoint!.x);
    const y = Math.min(this.selectionStartPoint!.y, this.selectionEndPoint!.y);
    return new Point(x, y);
  }

  private getDimensions(): [number, number] {
    const dx = Math.abs(this.selectionStartPoint!.x - this.selectionEndPoint!.x);
    const dy = Math.abs(this.selectionStartPoint!.y - this.selectionEndPoint!.y);
    return [dx, dy];
  }
}
