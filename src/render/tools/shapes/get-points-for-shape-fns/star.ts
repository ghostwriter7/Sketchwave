import type { CreatePointsForShapeFn } from '../../../../types/core.type.ts';
import { Point } from '../../../../types/Point.ts';

export const star: CreatePointsForShapeFn = (pointA: Point, pointB: Point): Point[] => {
  const width = pointB.x - pointA.x;
  const height = pointB.y - pointA.y;

  const oneThirdHeight = height * 0.33;

  const oneThirdY = pointA.y + oneThirdHeight;
  const twoThirdY = oneThirdY + oneThirdHeight;

  const y60 = pointA.y + .6 * height;
  const y37 = pointA.y + 0.37 * height;
  const endX = pointB.x;
  const startX = pointA.x;

  const northTipPoint = Point.horizontalMidPoint(pointA, pointB);
  const northEastInnerPoint = new Point(startX + 0.62 * width, y37);
  const eastTipPoint = new Point(endX, oneThirdY);
  const southEastTipPoint = new Point(width * 0.8 + pointA.x, pointB.y);
  const southEastInnerPoint = new Point(startX + .7 * width, y60);
  const southInnerPoint = new Point(northTipPoint.x, twoThirdY);
  const southWestInnerPoint = new Point(startX + 0.3 * width, y60);
  const southWestTipPoint = new Point(width * 0.2 + pointA.x, pointB.y);
  const westTipPoint = new Point(startX, oneThirdY);
  const northWestInnerPoint = new Point(startX + 0.38 * width, y37);

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
