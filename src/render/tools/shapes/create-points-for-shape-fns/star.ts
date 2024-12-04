import type { CreatePointsForShapeFn } from '../../../../types/core.type.ts';
import { Point } from '../../../../types/Point.ts';

export const star: CreatePointsForShapeFn = (pointA: Point, pointB: Point, dx: number, dy: number): Point[] => {
  const oneThirdHeight = dy * 0.33;

  const oneThirdY = pointA.y + oneThirdHeight;
  const twoThirdY = oneThirdY + oneThirdHeight;

  const y60 = pointA.y + .6 * dy;
  const y37 = pointA.y + 0.37 * dy;
  const endX = pointB.x;
  const startX = pointA.x;

  const northTipPoint = Point.horizontalMidPoint(pointA, pointB);
  const northEastInnerPoint = new Point(startX + 0.62 * dx, y37);
  const eastTipPoint = new Point(endX, oneThirdY);
  const southEastTipPoint = new Point(dx * 0.8 + pointA.x, pointB.y);
  const southEastInnerPoint = new Point(startX + .7 * dx, y60);
  const southInnerPoint = new Point(northTipPoint.x, twoThirdY);
  const southWestInnerPoint = new Point(startX + 0.3 * dx, y60);
  const southWestTipPoint = new Point(dx * 0.2 + pointA.x, pointB.y);
  const westTipPoint = new Point(startX, oneThirdY);
  const northWestInnerPoint = new Point(startX + 0.38 * dx, y37);

  return [
    northTipPoint,
    northEastInnerPoint,
    eastTipPoint,
    southEastInnerPoint,
    southEastTipPoint,
    southInnerPoint,
    southWestTipPoint,
    southWestInnerPoint,
    westTipPoint,
    northWestInnerPoint
  ];
}
