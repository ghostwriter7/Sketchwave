const canvas = document.getElementById('line-thickness') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const lineMap = new Map<ExtendedPath2D, { startX: number, endX: number }>();

type ExtendedPath2D = Path2D & { lineWidth: number };

const highlightSelectedLine = (path: ExtendedPath2D) => {
  ctx.strokeStyle = 'blue';
  lineMap.forEach((_, path) => {
    ctx.lineWidth = path.lineWidth;
    ctx.stroke(path)
  });
  ctx.lineWidth = path.lineWidth;
  ctx.strokeStyle = 'red';
  ctx.stroke(path);
}

export const initializeLineThicknessPicker = () => {
  canvas.height = 100;

  const gap = 10;
  const thicknesses = [1, 2, 3, 5, 7, 9, 11, 14, 17, 21];
  canvas.width = thicknesses.reduce((a, b) => a + b, 0) + thicknesses.length * gap;
  let currentX = gap;
  ctx.strokeStyle = 'blue'

  for (let i = 0; i < thicknesses.length; i++) {
    const thickness = thicknesses[i];
    const path = new Path2D() as ExtendedPath2D;
    lineMap.set(path, { startX: currentX, endX: currentX + thickness});
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    path.moveTo(currentX + thickness / 2, 5+  thickness / 2);
    path.lineTo(currentX + thickness / 2, 100 - 5 - thickness / 2);
    path.lineWidth = thickness;
    ctx.stroke(path);
    currentX += gap + thickness;
  }

  canvas.addEventListener('click', (event) => {
    const { offsetX } = event;

    const calcLineDistanceFromClick = (startX: number, endX: number) =>
      Math.min(Math.abs(offsetX - startX), Math.abs(offsetX - endX));

    const activeLine = [...lineMap.entries()]
      .reduce((currentThickness, [thickness, { startX, endX }]) => {
        if (!currentThickness) {
          return [thickness, calcLineDistanceFromClick(startX, endX)];
        }

        const distance = calcLineDistanceFromClick(startX, endX)
        return distance < currentThickness[1] ? [thickness, distance] : currentThickness;
      }, null)[0];

    highlightSelectedLine(activeLine);
  });
}
