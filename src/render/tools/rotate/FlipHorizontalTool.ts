import { FlipTool } from './FlipTool.ts';
import type { ToolState } from '../models/ToolState.ts';
import type { LayerFacade } from '../../LayerFacade.ts';

export class FlipHorizontalTool extends FlipTool {
  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade, (x: number, y: number, width: number, height: number) =>
      ((height - y - 1) * width + x) * 4);
  }
}
