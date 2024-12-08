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

export class ToolHandlerFactory {
  private static readonly toolKeyToTypeMap: Record<ToolType, new (toolState: ToolState, layerFacade: LayerFacade) => ToolHandler> = {
    airbrush: AirbrushTool,
    beadsBrush: BeadsBrush,
    brush: BrushTool,
    calligraphyBrush: CalligraphyBrushTool,
    eraser: EraserTool,
    line: LineTool,
    marker: Marker,
    pastelBrush: PastelBrush,
    shape: ShapeTool,
  }

  public static fromToolType(toolType: ToolType, toolState: ToolState, layerFacade: LayerFacade): ToolHandler {
    const type = this.toolKeyToTypeMap[toolType]

    if (!type) {
      throw new Error(`Unsupported tool type: ${toolType}`);
    }

    return new type(toolState, layerFacade);
  }
}
