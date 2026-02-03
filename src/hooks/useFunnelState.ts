import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Node,
  Edge,
  addEdge,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import { NodeType } from '../types/funnel.types';
import { useNodeFactory } from './useNodeFactory';
import { useValidation } from './useValidation';
import { useLocalStorage } from './useLocalStorage';
import { useUndoRedo } from './useUndoRedo';
import { FunnelData } from '../utils/funnelPersistence';

interface UseFunnelStateReturn {
  nodes: Node[];
  edges: Edge[];
  nodeCounters: { upsell: number; downsell: number };
  validationResult: ReturnType<typeof useValidation>['validationResult'];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeDrop: (nodeType: NodeType, position: { x: number; y: number }) => void;
  onNodesDelete: (nodeIds: string[]) => void;
  onEdgesDelete: (edgeIds: string[]) => void;
  saveFunnel: () => void;
  loadFunnel: () => void;
  importFunnel: (funnelData: FunnelData) => void;
  hasStoredFunnel: boolean;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useFunnelState = (): UseFunnelStateReturn => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeCounters, setNodeCounters] = useState({
    upsell: 0,
    downsell: 0,
  });

  const { createNode } = useNodeFactory();
  const { validationResult, getNodeValidationState } = useValidation(nodes, edges);
  const { saveFunnel: saveToStorage, loadFunnel: loadFromStorage, hasStoredFunnel } = useLocalStorage();
  const { undo: undoHistory, redo: redoHistory, canUndo, canRedo, pushToHistory, clearHistory } = useUndoRedo();

  // Auto-load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setNodes(stored.nodes);
      setEdges(stored.edges);
      setNodeCounters(stored.nodeCounters);
      // Push initial state to history
      pushToHistory(stored.nodes, stored.edges, stored.nodeCounters);
    } else {
      // Push initial empty state to history
      pushToHistory([], [], { upsell: 0, downsell: 0 });
    }
  }, [loadFromStorage, pushToHistory]);

  // Enrich nodes with validation state
  const nodesWithValidation = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        validation: getNodeValidationState(node.id),
      },
    }));
  }, [nodes, getNodeValidationState]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const updated = addEdge(params, eds);
        // Push to history after connection
        setTimeout(() => pushToHistory(nodes, updated, nodeCounters), 100);
        return updated;
      });
    },
    [nodes, nodeCounters, pushToHistory]
  );

  const onNodeDrop = useCallback(
    (nodeType: NodeType, position: { x: number; y: number }) => {
      try {
        const { node, updatedCounters } = createNode(nodeType, position, nodeCounters);
        setNodes((nds) => {
          const updated = [...nds, node];
          pushToHistory(updated, edges, updatedCounters);
          return updated;
        });
        setNodeCounters(updatedCounters);
      } catch (error) {
        console.error('Failed to create node:', error);
      }
    },
    [createNode, nodeCounters, edges, pushToHistory]
  );

  const onNodesDelete = useCallback(
    (nodeIds: string[]) => {
      setNodes((nds) => {
        const updated = nds.filter((node) => !nodeIds.includes(node.id));
        pushToHistory(updated, edges, nodeCounters);
        return updated;
      });
      // Also delete connected edges
      setEdges((eds) => {
        const updated = eds.filter(
          (edge) => !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
        );
        return updated;
      });
    },
    [edges, nodeCounters, pushToHistory]
  );

  const onEdgesDelete = useCallback(
    (edgeIds: string[]) => {
      setEdges((eds) => {
        const updated = eds.filter((edge) => !edgeIds.includes(edge.id));
        pushToHistory(nodes, updated, nodeCounters);
        return updated;
      });
    },
    [nodes, nodeCounters, pushToHistory]
  );

  const saveFunnel = useCallback(() => {
    try {
      saveToStorage(nodes, edges, nodeCounters);
    } catch (error) {
      console.error('Failed to save funnel:', error);
      throw error;
    }
  }, [nodes, edges, nodeCounters, saveToStorage]);

  const loadFunnel = useCallback(() => {
    const stored = loadFromStorage();
    if (stored) {
      setNodes(stored.nodes);
      setEdges(stored.edges);
      setNodeCounters(stored.nodeCounters);
    }
  }, [loadFromStorage]);

  const importFunnel = useCallback((funnelData: FunnelData) => {
    setNodes(funnelData.nodes);
    setEdges(funnelData.edges);
    setNodeCounters(funnelData.nodeCounters);
    clearHistory();
    pushToHistory(funnelData.nodes, funnelData.edges, funnelData.nodeCounters);
  }, [clearHistory, pushToHistory]);

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    const state = undoHistory();
    if (state) {
      setNodes(state.nodes);
      setEdges(state.edges);
      setNodeCounters(state.nodeCounters);
    }
  }, [undoHistory]);

  const handleRedo = useCallback(() => {
    const state = redoHistory();
    if (state) {
      setNodes(state.nodes);
      setEdges(state.edges);
      setNodeCounters(state.nodeCounters);
    }
  }, [redoHistory]);

  return {
    nodes: nodesWithValidation,
    edges,
    nodeCounters,
    validationResult,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDrop,
    onNodesDelete,
    onEdgesDelete,
    saveFunnel,
    loadFunnel,
    importFunnel,
    hasStoredFunnel: hasStoredFunnel(),
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
  };
};

