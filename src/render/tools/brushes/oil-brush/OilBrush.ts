import { BrushTool } from '../BrushTool.ts';
import type { ToolState } from '../../models/ToolState.ts';
import type { LayerFacade } from '../../../LayerFacade.ts';

export class OilBrush extends BrushTool {

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }
}
