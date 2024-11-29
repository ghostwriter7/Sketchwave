import type { ToolState } from '../../models/ToolState.ts';
import type { LayerFacade } from '../../../LayerFacade.ts';
import { SimpleBrush } from '../../abstract/SimpleBrush.ts';
import { calculateDistance } from '../../../../math/distance.ts';

export class OilBrush extends SimpleBrush {
  private readonly strokeLength = 250;
  private readonly minRadius: number;
  private readonly twentyPercentOfStrokeLength = this.strokeLength * 0.2;
  private readonly eightyPercentOfStrokeLength = this.strokeLength - this.twentyPercentOfStrokeLength;
  private readonly radiusScalingRatio = this.halfSize / this.twentyPercentOfStrokeLength;

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
    this.minRadius = 0.4 * this.halfSize;
  }

  public tryCreateLayer(): void {
    // throw new Error('Method not implemented.');
  }

  protected renderPreview() {
    if (this.points.length < 1) return;

    let currentStrokeLength = 0;

    for (let i = 1; i < this.points.length; i++) {
      const previousPoint = this.points[i - 1];
      const point = this.points[i];

      const distance = calculateDistance(previousPoint, point);
      currentStrokeLength += distance;

      if (currentStrokeLength >= this.strokeLength) return;

      const { x, y } = point;
      this.ctx.beginPath();

      const radius = this.calculateRadius(currentStrokeLength);

      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  private calculateRadius(currentStrokeLength: number): number {
    if (currentStrokeLength <= this.twentyPercentOfStrokeLength) {
      return Math.max(currentStrokeLength * this.radiusScalingRatio, this.minRadius);
    }

    if (currentStrokeLength >= this.eightyPercentOfStrokeLength) {
      const remainingLength = this.strokeLength - currentStrokeLength;
      return Math.max(remainingLength * this.radiusScalingRatio, this.minRadius);
    }

    return this.halfSize;
  }
}
