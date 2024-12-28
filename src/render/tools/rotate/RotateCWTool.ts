import { RotateTool } from './RotateTool.ts';
import type { ToolState } from '../models/ToolState.ts';
import type { LayerFacade } from '../../LayerFacade.ts';

export class RotateCWTool extends RotateTool {
  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade, true);
  }
}
