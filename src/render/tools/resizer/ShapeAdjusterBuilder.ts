import { ShapeAdjuster } from './ShapeAdjuster.ts';
import type { OnActionFinishHandler, OnCancelHandler, OnChangeHandler, OnCompleteHandler } from './types.ts';

export class ShapeAdjusterBuilder {
  private readonly shapeAdjuster = new ShapeAdjuster();

  public insertAt(container: HTMLElement): this {
    this.shapeAdjuster.container = container;
    return this;
  }

  public setOnChange(onChange: OnChangeHandler): this {
    this.shapeAdjuster.onChangeHandler = onChange;
    return this;
  }

  public setOnComplete(onComplete: OnCompleteHandler): this {
    this.shapeAdjuster.onCompleteHandler = onComplete;
    return this;
  }

  public setOnCancel(onCancel: OnCancelHandler): this {
    this.shapeAdjuster.onCancelHandler = onCancel;
    return this;
  }

  public setOnActionFinish(onActionFinish: OnActionFinishHandler): this {
    this.shapeAdjuster.onActionFinishHandler = onActionFinish;
    return this;
  }

  public setMinimalSize(minimalSize: number): this {
    this.shapeAdjuster.minimalSize = minimalSize;
    return this;
  }

  public setScale(scale: number): this {
    this.shapeAdjuster.scale = scale;
    this.shapeAdjuster.canvas.style.transform = `scale(${scale})`;
    return this;
  }

  public setDimensions(width: number, height: number): this {
    this.shapeAdjuster.canvas.width = width;
    this.shapeAdjuster.canvas.height = height;
    return this;
  }

  public setStyles(styles: Partial<CSSStyleDeclaration>): this {
    Object.entries(styles).forEach(([property, value]) =>
      /* @ts-ignore */
      this.shapeAdjuster.canvas.style[property] = value);
    return this;
  }

  public withRotationDisabled(): this {
    this.shapeAdjuster.rotationEnabled = false;
    return this;
  }

  public withMoveDisabled(): this {
    this.shapeAdjuster.moveEnabled = false;
    return this;
  }

  public withoutDashedBoxAtInit(): this {
    this.shapeAdjuster.drawDashedBoxAtInit = false;
    return this;
  }

  public build(): ShapeAdjuster {
    return this.shapeAdjuster;
  }
}
