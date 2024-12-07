export const RESIZE_CURSORS = ['nw-resize', 'n-resize', 'ne-resize', 'w-resize', 'e-resize', 'sw-resize', 's-resize', 'se-resize'] as const;

export const RESIZE_ACTIONS: Record<string, {
  originX?: boolean,
  originY?: boolean,
  width?: number,
  height?: number
}> = {
  'nw-resize': {
    originX: true,
    originY: true,
    width: -1,
    height: -1,
  },
  'n-resize': {
    height: -1,
    originY: true,
  },
  'ne-resize': {
    originY: true,
    width: 1,
    height: -1,
  },
  'w-resize': {
    originX: true,
    width: -1,
  },
  'e-resize': {
    width: 1
  },
  'sw-resize': {
    originX: true,
    height: 1,
    width: -1
  },
  's-resize': {
    height: 1
  },
  'se-resize': {
    width: 1,
    height: 1
  }
}
