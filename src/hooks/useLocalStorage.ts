import { useCallback } from 'react';
import {
  saveFunnelToLocalStorage,
  loadFunnelFromLocalStorage,
  FunnelData,
} from '../utils/funnelPersistence';
import { Node, Edge } from 'reactflow';

interface UseLocalStorageReturn {
  saveFunnel: (nodes: Node[], edges: Edge[], nodeCounters: { upsell: number; downsell: number }) => void;
  loadFunnel: () => FunnelData | null;
  hasStoredFunnel: () => boolean;
}

export const useLocalStorage = (): UseLocalStorageReturn => {
  const saveFunnel = useCallback(
    (nodes: Node[], edges: Edge[], nodeCounters: { upsell: number; downsell: number }) => {
      saveFunnelToLocalStorage(nodes, edges, nodeCounters);
    },
    []
  );

  const loadFunnel = useCallback(() => {
    return loadFunnelFromLocalStorage();
  }, []);

  const hasStoredFunnel = useCallback(() => {
    try {
      return localStorage.getItem('cartpanda-funnel-data') !== null;
    } catch {
      return false;
    }
  }, []);

  return {
    saveFunnel,
    loadFunnel,
    hasStoredFunnel,
  };
};

