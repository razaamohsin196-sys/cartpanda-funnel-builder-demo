import { useCallback } from 'react';
import { Node } from 'reactflow';
import { NodeType } from '../types/funnel.types';
import { NODE_TEMPLATES } from '../constants/nodeConfig';

interface UseNodeFactoryReturn {
  createNode: (
    nodeType: NodeType,
    position: { x: number; y: number },
    counters: { upsell: number; downsell: number }
  ) => { node: Node; updatedCounters: { upsell: number; downsell: number } };
}

export const useNodeFactory = (): UseNodeFactoryReturn => {
  const createNode = useCallback(
    (
      nodeType: NodeType,
      position: { x: number; y: number },
      counters: { upsell: number; downsell: number }
    ) => {
      const template = NODE_TEMPLATES.find((t) => t.type === nodeType);
      if (!template) {
        throw new Error(`Template not found for node type: ${nodeType}`);
      }

      let title = template.defaultTitle;
      let nodeId = `${nodeType}-${Date.now()}`;
      const updatedCounters = { ...counters };

      // Auto-increment labels for upsells and downsells
      if (nodeType === 'upsell') {
        updatedCounters.upsell += 1;
        title = `Upsell ${updatedCounters.upsell}`;
        nodeId = `upsell-${updatedCounters.upsell}`;
      } else if (nodeType === 'downsell') {
        updatedCounters.downsell += 1;
        title = `Downsell ${updatedCounters.downsell}`;
        nodeId = `downsell-${updatedCounters.downsell}`;
      }

      const node: Node = {
        id: nodeId,
        type: nodeType,
        position,
        data: {
          title,
          buttonLabel: template.defaultButtonLabel,
          icon: template.icon,
        },
      };

      return { node, updatedCounters };
    },
    []
  );

  return { createNode };
};

