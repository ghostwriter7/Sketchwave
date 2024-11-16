export
const rgbToHue = (red: number, green: number, blue: number) => {
  red /= 255;
  green /= 255;
  blue /= 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);

  const delta = max - min;

  let hue = 0;

  if (delta === 0) {
    hue = 0;  // Undefined hue (gray color)
  } else if (max === red) {
    hue = ((green - blue) / delta) % 6;
  } else if (max === green) {
    hue = ((blue - red) / delta) + 2;
  } else {  // Cmax === b
    hue = ((red - green) / delta) + 4;
  }

  // Convert Hue to degrees
  hue = hue * 60;
  if (hue < 0) hue += 360;

  return hue;
}
