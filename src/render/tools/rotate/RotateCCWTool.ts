import { RotateTool } from './RotateTool.ts';
import type { ToolState } from '../models/ToolState.ts';
import type { LayerFacade } from '../../LayerFacade.ts';

export class RotateCCWTool extends RotateTool {
  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade, false);
  }
}
