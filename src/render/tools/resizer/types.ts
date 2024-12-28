import { Point } from '../../../types/Point.ts';

type Handler = (origin: Point, width: number, height: number, angle: number) => void;

export type OnChangeHandler = Handler;
export type OnCompleteHandler = Handler;
export type OnCancelHandler = () => void;
export type OnActionFinishHandler = () => void;
