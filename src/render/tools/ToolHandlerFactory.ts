import type { ToolType } from '../../types/core.type.ts';
import type { ToolHandler } from './abstract/ToolHandler.ts';
import type { ToolState } from './models/ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { LineTool } from './LineTool.ts';
import { EraserTool } from './EraserTool.ts';
import { BrushTool } from './brushes/brush/BrushTool.ts';
import { AirbrushTool } from './brushes/airbrush/AirbrushTool.ts';
import { CalligraphyBrushTool } from './brushes/caligraphy-brush/CalligraphyBrushTool.ts';
import { PastelBrush } from './brushes/oil-brush/PastelBrush.ts';
import { Marker } from './brushes/marker/Marker.ts';
import { ShapeTool } from './shapes/ShapeTool.ts';
import { BeadsBrush } from './brushes/beads-brush/BeadsBrush.ts';
import { WiggleLineBrush } from './brushes/wiggle-line-brush/WiggleLineBrush.ts';
import { FillSpace } from './fill-space/FillSpace.ts';
import { ImportImage } from './import-image/ImportImage.ts';
import { RotateCCWTool } from './rotate/RotateCCWTool.ts';
import { RotateCWTool } from './rotate/RotateCWTool.ts';
import { FlipVerticalTool } from './rotate/FlipVerticalTool.ts';
import { FlipHorizontalTool } from './rotate/FlipHorizontalTool.ts';

export class ToolHandlerFactory {
  private static readonly toolKeyToTypeMap: Record<ToolType, new (toolState: ToolState, layerFacade: LayerFacade) => ToolHandler> = {
    airbrush: AirbrushTool,
    beadsBrush: BeadsBrush,
    brush: BrushTool,
    calligraphyBrush: CalligraphyBrushTool,
    eraser: EraserTool,
    fillSpace: FillSpace,
    flipHorizontal: FlipHorizontalTool,
    flipVertical: FlipVerticalTool,
    importImage: ImportImage,
    line: LineTool,
    marker: Marker,
    rotateCCW: RotateCCWTool,
    rotateCW: RotateCWTool,
    pastelBrush: PastelBrush,
    shape: ShapeTool,
    wiggleLineBrush: WiggleLineBrush,
  }

  public static fromToolType(toolType: ToolType, toolState: ToolState, layerFacade: LayerFacade): ToolHandler {
    const type = this.toolKeyToTypeMap[toolType]

    if (!type) {
      throw new Error(`Unsupported tool type: ${toolType}`);
    }

    return new type(toolState, layerFacade);
  }
}
