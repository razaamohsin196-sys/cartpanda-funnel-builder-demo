import { useMemo } from 'react';
import { Node, Edge } from 'reactflow';
import { validateFunnel, getOutgoingEdges, getIncomingEdges } from '../utils/nodeValidation';
import { NodeType } from '../types/funnel.types';

export interface NodeValidationState {
  nodeId: string;
  hasError: boolean;
  hasWarning: boolean;
  errorMessage?: string;
  warningMessage?: string;
}

export interface UseValidationReturn {
  validationResult: ReturnType<typeof validateFunnel>;
  getNodeValidationState: (nodeId: string) => NodeValidationState | undefined;
}

export const useValidation = (nodes: Node[], edges: Edge[]): UseValidationReturn => {
  const validationResult = useMemo(() => validateFunnel(nodes, edges), [nodes, edges]);

  const nodeValidationStates = useMemo(() => {
    const states = new Map<string, NodeValidationState>();

    nodes.forEach((node) => {
      const nodeType = node.type as NodeType;
      const outgoingEdges = getOutgoingEdges(node.id, edges);
      const incomingEdges = getIncomingEdges(node.id, edges);

      let hasError = false;
      let hasWarning = false;
      let errorMessage: string | undefined;
      let warningMessage: string | undefined;

      // Thank You nodes should have no outgoing edges
      if (nodeType === 'thankYou' && outgoingEdges.length > 0) {
        hasError = true;
        errorMessage = 'Thank You nodes should not have outgoing connections';
      }

      // Sales Page should have exactly one outgoing edge
      if (nodeType === 'salesPage') {
        if (outgoingEdges.length === 0) {
          hasWarning = true;
          warningMessage = 'Sales Page should have at least one outgoing connection';
        } else if (outgoingEdges.length > 1) {
          hasWarning = true;
          warningMessage = `Sales Page typically has one outgoing connection, but has ${outgoingEdges.length}`;
        }
      }

      // Orphan nodes (no connections)
      if (outgoingEdges.length === 0 && incomingEdges.length === 0 && nodeType !== 'salesPage') {
        hasWarning = true;
        warningMessage = 'This node is not connected to the funnel';
      }

      states.set(node.id, {
        nodeId: node.id,
        hasError,
        hasWarning,
        errorMessage,
        warningMessage,
      });
    });

    return states;
  }, [nodes, edges]);

  const getNodeValidationState = useMemo(
    () => (nodeId: string) => nodeValidationStates.get(nodeId),
    [nodeValidationStates]
  );

  return {
    validationResult,
    getNodeValidationState,
  };
};

