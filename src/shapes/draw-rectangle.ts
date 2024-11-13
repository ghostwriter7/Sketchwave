const drawRectangle = (ctx: CanvasRenderingContext2D, color: string, origin: [number, number], dimensions: [number, number]): void => {
    ctx.fillStyle = color;
    ctx.fillRect(...origin, ...dimensions);
}

export default drawRectangle;