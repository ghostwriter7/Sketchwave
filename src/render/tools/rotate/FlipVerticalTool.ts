import { FlipTool } from './FlipTool.ts';
import type { ToolState } from '../models/ToolState.ts';
import type { LayerFacade } from '../../LayerFacade.ts';

export class FlipVerticalTool extends FlipTool {
  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade, (x: number, y: number, width: number) =>
      (y * width + (width - x - 1)) * 4);
  }
}
