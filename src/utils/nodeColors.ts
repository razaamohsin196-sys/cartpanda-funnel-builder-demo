import { NodeType } from '../types/funnel.types';

export const getNodeColor = (type: NodeType): string => {
  const colorMap: Record<NodeType, string> = {
    salesPage: '#3b82f6', // blue-500
    orderPage: '#10b981', // green-500
    upsell: '#a855f7',    // purple-500
    downsell: '#f97316',   // orange-500
    thankYou: '#14b8a6',   // teal-500
  };
  return colorMap[type] || '#94a3b8';
};

export const getNodeColorWithOpacity = (type: NodeType, opacity: number = 0.1): string => {
  const color = getNodeColor(type);
  // Convert hex to rgba
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

