import { useCallback } from 'react';
import { DRAG_DATA_KEY, DRAG_EFFECT } from '../constants/app.constants';

interface UseDragAndDropReturn {
  handleDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export const useDragAndDrop = (): UseDragAndDropReturn => {
  const handleDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData(DRAG_DATA_KEY, nodeType);
    event.dataTransfer.effectAllowed = DRAG_EFFECT;
  }, []);

  return { handleDragStart };
};

