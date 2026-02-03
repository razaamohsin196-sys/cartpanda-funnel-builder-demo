import { Node, Edge } from 'reactflow';
import { NodeType } from '../types/funnel.types';

/**
 * Check if a node type can have incoming connections
 */
export const canHaveIncomingConnections = (nodeType: NodeType): boolean => {
  return nodeType !== 'salesPage';
};

/**
 * Check if a node type can have outgoing connections
 */
export const canHaveOutgoingConnections = (nodeType: NodeType): boolean => {
  return nodeType !== 'thankYou';
};

/**
 * Get outgoing edges for a node
 */
export const getOutgoingEdges = (nodeId: string, edges: Edge[]): Edge[] => {
  return edges.filter((edge) => edge.source === nodeId);
};

/**
 * Get incoming edges for a node
 */
export const getIncomingEdges = (nodeId: string, edges: Edge[]): Edge[] => {
  return edges.filter((edge) => edge.target === nodeId);
};

/**
 * Validate funnel rules
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateFunnel = (nodes: Node[], edges: Edge[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  nodes.forEach((node) => {
    const nodeType = node.type as NodeType;
    const outgoingEdges = getOutgoingEdges(node.id, edges);

    // Thank You nodes should have no outgoing edges
    if (nodeType === 'thankYou' && outgoingEdges.length > 0) {
      errors.push(`"${node.data.title}" (Thank You) should not have outgoing connections`);
    }

    // Sales Page should have exactly one outgoing edge (warning if invalid)
    if (nodeType === 'salesPage') {
      if (outgoingEdges.length === 0) {
        warnings.push(`"${node.data.title}" (Sales Page) should have at least one outgoing connection`);
      } else if (outgoingEdges.length > 1) {
        warnings.push(`"${node.data.title}" (Sales Page) typically has one outgoing connection, but has ${outgoingEdges.length}`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

