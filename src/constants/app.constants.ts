// Drag and Drop
export const DRAG_DATA_KEY = 'application/reactflow';
export const DRAG_EFFECT = 'move';

// Canvas
export const BACKGROUND_COLOR = '#e5e7eb';
export const BACKGROUND_GAP = 16;
export const MINIMAP_MASK_COLOR = 'rgba(0, 0, 0, 0.1)';

// Accessibility
export const ARIA_LABELS = {
  PALETTE: 'Node palette - drag nodes to canvas',
  CANVAS: 'Funnel canvas - drag and drop nodes here',
  PALETTE_ITEM: (label: string) => `Drag ${label} node to canvas`,
} as const;

