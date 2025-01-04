type Point = [number, number];
type Dimensions = { width: number; height: number };
type OriginAndDimensions = { origin: Point } & Dimensions;
type CapturedPoints = { startPoint: Point, endPoint: Point };

function createCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.position = 'fixed';
  (canvas.style.zIndex as unknown as number) = 10000000;
  (canvas.style.inset as unknown as number) = 0;
  canvas.style.cursor = 'crosshair';

  document.body.appendChild(canvas);
  return canvas;
}

function renderTransparentBackground(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = 'rgba(0, 0, 0, .25)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function renderPreview(ctx: CanvasRenderingContext2D, dimensions: { origin: [number, number], width: number, height: number}): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  renderTransparentBackground(ctx);
  const { origin, width, height } = dimensions;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
  ctx.fillRect(...origin, width, height);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.strokeRect(...origin, width, height);
}

function getOriginAndDimensions(points: CapturedPoints): OriginAndDimensions {
  const { startPoint, endPoint } = points;
  const origin = [Math.min(startPoint![0], endPoint![0]), Math.min(startPoint![1], endPoint![1])] as [number, number];

  const width = Math.max(startPoint![0], endPoint![0]) - origin[0];
  const height = Math.max(startPoint![1], endPoint![1]) - origin[1];

  return { origin, width, height };
}

document.addEventListener('keydown', async (event) => {
  if (event.ctrlKey && event.shiftKey && event.code === 'KeyK') {
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d')!;

    renderTransparentBackground(ctx);

    const points: Partial<CapturedPoints> = {};

    const abortController = new AbortController();
    const options = { signal: abortController.signal };

    canvas.addEventListener('mousedown', (event: MouseEvent) => {
      points.startPoint = [event.offsetX, event.offsetY];
    }, options);

    canvas.addEventListener('mousemove', (event: MouseEvent) => {
      if (event.buttons === 1 && points.startPoint) {
        points.endPoint = [event.offsetX, event.offsetY];
        renderPreview(ctx, getOriginAndDimensions(points as CapturedPoints));
      }
    }, options);

    canvas.addEventListener('mouseup', () => {
      if (points.startPoint && points.endPoint) {
        abortController.abort();
        canvas.remove();
        const { origin, width, height } = getOriginAndDimensions(points as CapturedPoints);
        const { devicePixelRatio } = window;
        chrome.runtime.sendMessage({
            command: 'captureScreenshot',
            payload: {
              origin: [origin[0] * devicePixelRatio, origin[1] * devicePixelRatio],
              width: width * devicePixelRatio,
              height: height * devicePixelRatio
            }
          },
          (response) => console.log(response)
        );
      }
    }, options);
  }
});
