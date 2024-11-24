import type { ToolState } from '../models/ToolState.ts';

export const applyToolState = (ctx: CanvasRenderingContext2D, toolState: ToolState): void => {
  if (toolState.fillStyle) ctx.fillStyle = toolState.fillStyle;
  if (toolState.lineCap) ctx.lineCap = toolState.lineCap;
  if (toolState.lineJoin) ctx.lineJoin = toolState.lineJoin;
  if (toolState.lineWidth) ctx.lineWidth = toolState.lineWidth;
  if (toolState.strokeStyle) ctx.strokeStyle = toolState.strokeStyle;
}
