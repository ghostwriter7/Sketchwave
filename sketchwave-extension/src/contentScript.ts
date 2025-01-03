document.addEventListener('keydown', async (event) => {
  if (event.ctrlKey && event.shiftKey && event.code === 'KeyK') {
    const canvas = document.createElement('canvas');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.style.position = 'absolute';
    (canvas.style.zIndex as unknown as number) = 10000000;
    (canvas.style.inset as unknown as number) = 0;
    document.body.style.overflow = 'hidden';

    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;

    const renderTransparentBackground = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, .25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    renderTransparentBackground();

    canvas.style.cursor = 'crosshair';

    const points: {
      startPoint?: [number, number];
      endPoint?: [number, number];
    } = {};

    const getOriginAndDimensions = () => {
      const { startPoint, endPoint } = points;
      const origin = [Math.min(startPoint![0], endPoint![0]), Math.min(startPoint![1], endPoint![1])] as [number, number];

      const width = Math.max(startPoint![0], endPoint![0]) - origin[0];
      const height = Math.max(startPoint![1], endPoint![1]) - origin[1];

      return { origin, width, height };
    }

    const renderPreview = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderTransparentBackground();
      const { origin, width, height } = getOriginAndDimensions();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
      ctx.fillRect(...origin, width, height);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeRect(...origin, width, height);
    }


    const abortController = new AbortController();
    const options = { signal: abortController.signal };

    canvas.addEventListener('mousedown', (event: MouseEvent) => {
      points.startPoint = [event.offsetX, event.offsetY];
    }, options);

    canvas.addEventListener('mousemove', (event: MouseEvent) => {
      if (event.buttons === 1 && points.startPoint) {
        points.endPoint = [event.offsetX, event.offsetY];
        renderPreview();
      }
    }, options);

    canvas.addEventListener('mouseup', () => {
      if (points.startPoint && points.endPoint) {
        abortController.abort();
        canvas.remove();
        chrome.runtime.sendMessage({ command: 'captureScreenshot', payload: getOriginAndDimensions() },
          (response) => {
            console.log(response);
          });
      }
    }, options);
  }
});
