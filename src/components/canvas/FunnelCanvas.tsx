import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  ReactFlowInstance,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { NodeType } from '../../types/funnel.types';
import { getNodeColor } from '../../utils/nodeColors';
import { useNodeTypes } from '../../hooks/useNodeTypes';
import {
  DRAG_DATA_KEY,
  ARIA_LABELS,
  BACKGROUND_COLOR,
  BACKGROUND_GAP,
  MINIMAP_MASK_COLOR,
} from '../../constants/app.constants';

interface FunnelCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeDrop: (nodeType: NodeType, position: { x: number; y: number }) => void;
  onNodesDelete?: (nodeIds: string[]) => void;
  onEdgesDelete?: (edgeIds: string[]) => void;
}

const FunnelCanvasInner: React.FC<FunnelCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDrop,
  onNodesDelete,
  onEdgesDelete,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  const nodeTypes = useNodeTypes();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance || !reactFlowWrapper.current) {
        return;
      }

      const nodeType = event.dataTransfer.getData(DRAG_DATA_KEY) as NodeType;
      
      if (!nodeType) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      onNodeDrop(nodeType, position);
    },
    [reactFlowInstance, onNodeDrop]
  );

  const minimapNodeColor = useCallback(
    (node: Node) => getNodeColor(node.type as NodeType),
    []
  );

  // Handle node deletion
  const onNodesDeleteHandler = useCallback(
    (changes: NodeChange[]) => {
      const deletedNodeIds = changes
        .filter((change) => change.type === 'remove')
        .map((change) => (change as { id: string }).id);

      if (deletedNodeIds.length > 0 && onNodesDelete) {
        onNodesDelete(deletedNodeIds);
      }

      onNodesChange(changes);
    },
    [onNodesChange, onNodesDelete]
  );

  // Handle edge deletion
  const onEdgesDeleteHandler = useCallback(
    (changes: EdgeChange[]) => {
      const deletedEdgeIds = changes
        .filter((change) => change.type === 'remove')
        .map((change) => (change as { id: string }).id);

      if (deletedEdgeIds.length > 0 && onEdgesDelete) {
        onEdgesDelete(deletedEdgeIds);
      }

      onEdgesChange(changes);
    },
    [onEdgesChange, onEdgesDelete]
  );

  return (
    <div
      className="w-full h-full"
      ref={reactFlowWrapper}
      role="region"
      aria-label={ARIA_LABELS.CANVAS}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesDeleteHandler}
        onEdgesChange={onEdgesDeleteHandler}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode={['Meta', 'Control']}
        // Pan and zoom configuration
        panOnDrag={[1, 2]} // Enable panning with left and middle mouse buttons
        panOnScroll={false} // Disable pan on scroll (use scroll for zoom instead)
        zoomOnScroll={true} // Enable zoom with mouse wheel
        zoomOnPinch={true} // Enable zoom with pinch gesture (touch devices)
        zoomOnDoubleClick={false} // Disable zoom on double click (to avoid conflicts)
        minZoom={0.1} // Minimum zoom level
        maxZoom={2} // Maximum zoom level
        defaultViewport={{ x: 0, y: 0, zoom: 1 }} // Initial viewport
      >
        <Background color={BACKGROUND_COLOR} gap={BACKGROUND_GAP} />
        <Controls />
        <MiniMap nodeColor={minimapNodeColor} maskColor={MINIMAP_MASK_COLOR} />
      </ReactFlow>
    </div>
  );
};

const FunnelCanvas: React.FC<FunnelCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <FunnelCanvasInner {...props} />
    </ReactFlowProvider>
  );
};

export default FunnelCanvas;

