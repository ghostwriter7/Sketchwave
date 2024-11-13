import './style.css'

const canvas = document.getElementById('app') as HTMLCanvasElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;

window.ctx = ctx;
window.canvas = canvas;

const drawRectangle = (ctx: CanvasRenderingContext2D, color: string, origin: [number, number], dimensions: [number, number]): void => {
    ctx.fillStyle = color;
    ctx.fillRect(...origin, ...dimensions);
}

drawRectangle(ctx, "green", [20, 40], [300, 100]);
