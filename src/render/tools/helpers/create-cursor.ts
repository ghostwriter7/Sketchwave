export const createCursor = async (size: number, contextHandler: (ctx: OffscreenCanvasRenderingContext2D) => void): Promise<{
  objectUrl: string, cursor: string;
}> => {
  const offscreenCanvas = new OffscreenCanvas(size, size);
  const ctx = offscreenCanvas.getContext('2d')!;

  contextHandler(ctx);

  const blob = await offscreenCanvas.convertToBlob();
  const objectUrl = URL.createObjectURL(blob);
  const halfSize = size / 2;
  return { objectUrl, cursor: `url('${objectUrl}') ${halfSize} ${halfSize}, auto` };
}
