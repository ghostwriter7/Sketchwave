import type { Coordinates } from '../types/core.type.ts';

export const calculateDistance = ([xA, yA]: Coordinates, [xB, yB]: Coordinates): number => {
  const dx = xA - xB;
  const dy = yA - yB;
  return Math.sqrt(dx * dx + dy * dy);
}
