import './resizer.css';
import { createEffect } from 'solid-js';
import { Point } from '../../types/Point.ts';
import { useGlobalContext } from '../../global-provider.tsx';
import { ShapeAdjuster } from '../../render/tools/resizer/ShapeAdjuster.ts';
import { noop } from '../../utils/noop.ts';
import { ShapeAdjusterBuilder } from '../../render/tools/resizer/ShapeAdjusterBuilder.ts';

export const Resizer = () => {
  const { state } = useGlobalContext();

  const resizerRef = <div
    class="resizer"
    style={{
      width: `${state.resizableDimensions.width}px`,
      height: `${state.resizableDimensions.height}px`,
    }}
  ></div> as HTMLDivElement;


  const getActualCanvasDimensions = (): { width: number, height: number } =>
    document.querySelector('.canvas')!.getBoundingClientRect();

  const getOriginXAndY = () => {
    const { width, height } = getActualCanvasDimensions();
    return {
      originX: state.resizableDimensions.width / 2 - width / 2,
      originY: state.resizableDimensions.height / 2 - height / 2
    };
  }

  let shapeAdjuster: ShapeAdjuster;

  createEffect(() => {
    state.scale;
    state.width;
    state.height;

    if (shapeAdjuster) shapeAdjuster.destroy();

    const { originX, originY } = getOriginXAndY();

    shapeAdjuster = new ShapeAdjusterBuilder()
      .insertAt(resizerRef)
      .withRotationDisabled()
      .withMoveDisabled()
      .withoutDashedBoxAtInit()
      .withCompleteOnNonActionClickDisabled()
      .setDimensions(
        state.resizableDimensions.width,
        state.resizableDimensions.height
      )
      .setOnActionFinish(() => shapeAdjuster.complete())
      .setOnChange(() => resizerRef.style.zIndex = '100')
      .setOnComplete((origin, width, height) => {
          state.layerFacade!.pushLayer({
            originX: (origin.x / state.scale) - originX,
            originY: (origin.y / state.scale) - originY,
            canvasWidth: width / state.scale,
            canvasHeight: height / state.scale,
            tool: 'Resizer',
            draw: noop
          });
          state.layerFacade!.renderLayers();
          resizerRef.style.zIndex = '0';
        }
      )
      .build();

    const { width, height } = getActualCanvasDimensions();
    shapeAdjuster.renderBoxBetweenStartAndEndPoints(
      new Point(originX, originY),
      new Point(originX + width, originY + height),
    );

  });

  return resizerRef;
}
