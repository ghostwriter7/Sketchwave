import type { Options, RotateAction } from '../../../types/core.type.ts';

export const ROTATE_OPTIONS: Options<RotateAction> = [
  {
    icon: 'rotate_left',
    label: '90° left',
    value: 'rotateCCW'
  },
  {
    icon: 'rotate_right',
    label: '90° right',
    value: 'rotateCW'
  },
  {
    icon: 'border_horizontal',
    label: 'Flip horizontally',
    value: 'flipHorizontal'
  },
  {
    icon: 'border_vertical',
    label: 'Flip vertically',
    value: 'flipVertical'
  }
];
