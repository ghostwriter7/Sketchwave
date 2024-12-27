import type { Options, RotateAction } from '../../../types/core.type.ts';

export const ROTATE_OPTIONS: Options<RotateAction> = [
  {
    icon: 'rotate_left',
    label: '90° left',
    value: 'rotateLeft'
  },
  {
    icon: 'rotate_right',
    label: '90° right',
    value: 'rotateRight'
  },
  {
    icon: 'flip',
    label: '180°',
    value: 'flip'
  }
];
