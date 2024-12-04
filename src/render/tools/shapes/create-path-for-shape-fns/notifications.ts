import type { CreatePathForShapeFn } from '../../../../types/core.type.ts';
import type { Point } from '../../../../types/Point.ts';

export const notifications: CreatePathForShapeFn = (origin: Point, endPoint: Point, dx: number, dy: number): Path2D => {
  const path = new Path2D();

  const bottomLineTopY = origin.y + dy * .8;
  const bottomLineBottomY = origin.y + dy * .9;

  const bellTopY = origin.y + dy * .1;

  path.moveTo(origin.x, bottomLineTopY);
  path.lineTo(origin.x, bottomLineBottomY);
  path.lineTo(endPoint.x, bottomLineBottomY);
  path.lineTo(endPoint.x, bottomLineTopY);
  path.lineTo(origin.x, bottomLineTopY);
  path.moveTo(endPoint.x - .1 * dx, bottomLineTopY);

  path.quadraticCurveTo(endPoint.x - dx * .1, bellTopY, origin.x + dx * .5, bellTopY);
  path.quadraticCurveTo(origin.x + dx * .1, bellTopY, origin.x + dx * .1, bottomLineTopY);

  const buttonRadius = dy * .08;
  const buttonX = origin.x + .5 * dx;
  const bottomButtonY = endPoint.y - buttonRadius;

  path.moveTo(buttonX, bottomButtonY);
  path.arc(buttonX, bottomButtonY, buttonRadius, 0, Math.PI);
  path.lineTo(buttonX, bottomButtonY);

  const topButtonY =  origin.y + buttonRadius;
  path.moveTo(buttonX, topButtonY);
  path.arc(buttonX, topButtonY, buttonRadius, 0, Math.PI, true);
  path.lineTo(buttonX, topButtonY);

  return path;
}

