import { useState, useCallback, useMemo } from 'react';
import { Node, Edge } from 'reactflow';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
  nodeCounters: { upsell: number; downsell: number };
}

const MAX_HISTORY_SIZE = 50;

export const useUndoRedo = () => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushToHistory = useCallback(
    (nodes: Node[], edges: Edge[], nodeCounters: { upsell: number; downsell: number }) => {
      const newState: HistoryState = {
        nodes: JSON.parse(JSON.stringify(nodes)), // Deep clone
        edges: JSON.parse(JSON.stringify(edges)), // Deep clone
        nodeCounters: { ...nodeCounters },
      };

      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        const updatedHistory = [...newHistory, newState];

        // Limit history size
        if (updatedHistory.length > MAX_HISTORY_SIZE) {
          updatedHistory.shift();
          setHistoryIndex(MAX_HISTORY_SIZE - 1);
          return updatedHistory;
        }

        setHistoryIndex(updatedHistory.length - 1);
        return updatedHistory;
      });
    },
    [historyIndex]
  );

  const undo = useCallback((): HistoryState | null => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [history, historyIndex]);

  const redo = useCallback((): HistoryState | null => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [history, historyIndex]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  const canUndo = useMemo(() => historyIndex > 0, [historyIndex]);
  const canRedo = useMemo(() => historyIndex < history.length - 1, [historyIndex, history.length]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    pushToHistory,
    clearHistory,
  };
};
