import type { LayerFacade } from '../global-provider.tsx';
import type { Coordinates } from '../types/core.type.ts';

export type ToolHandler = (layerFacade: LayerFacade, clicks: Coordinates[], mousePosition?: Coordinates) => void;

export type Tool = 'rectFill' | 'select';
