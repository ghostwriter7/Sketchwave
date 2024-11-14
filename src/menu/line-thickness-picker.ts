const canvas = document.getElementById('line-thickness') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const lineMap = new Map<Path2D, { startX: number, endX: number }>();

const highlightSelectedLine = (path: Path2D) => {
  ctx.fillStyle = 'blue';
  lineMap.forEach((_, path) => ctx.fill(path));
  ctx.fillStyle = 'red';
  ctx.fill(path);
}

export const initializeLineThicknessPicker = () => {
  canvas.height = 100;

  const gap = 10;
  const thicknesses = [1, 2, 3, 5, 7, 9, 11, 14, 17, 21];
  canvas.width = thicknesses.reduce((a, b) => a + b, 0) + thicknesses.length * gap;
  let currentX = gap;
  ctx.fillStyle = 'blue'

  for (let i = 0; i < thicknesses.length; i++) {
    const thickness = thicknesses[i];
    const path = new Path2D();
    lineMap.set(path, { startX: currentX, endX: currentX + thickness});
    path.rect(currentX, 0, thickness, canvas.height);
    ctx.fill(path);
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
