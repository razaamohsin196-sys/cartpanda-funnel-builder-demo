import FunnelCanvas from './components/canvas/FunnelCanvas';
import NodePalette from './components/palette/NodePalette';
import ErrorBoundary from './components/ErrorBoundary';
import FunnelBuilderLayout from './components/layout/FunnelBuilderLayout';
import ValidationPanel from './components/ui/ValidationPanel';
import Toolbar from './components/ui/Toolbar';
import ToastContainer from './components/ui/ToastContainer';
import EmptyState from './components/ui/EmptyState';
import { useFunnelState } from './hooks/useFunnelState';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useToast } from './hooks/useToast';

function App() {
  const {
    nodes,
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
    hasStoredFunnel,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useFunnelState();

  const { handleDragStart } = useDragAndDrop();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const isEmpty = nodes.length === 0;

  return (
    <ErrorBoundary>
      <FunnelBuilderLayout
        palette={<NodePalette onNodeDragStart={handleDragStart} />}
        canvas={
          <>
            <FunnelCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeDrop={onNodeDrop}
              onNodesDelete={onNodesDelete}
              onEdgesDelete={onEdgesDelete}
            />
            {isEmpty && <EmptyState />}
            <Toolbar
              nodes={nodes}
              edges={edges}
              nodeCounters={nodeCounters}
              onSave={saveFunnel}
              onLoad={loadFunnel}
              onImport={importFunnel}
              hasStoredFunnel={hasStoredFunnel}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
              onShowSuccess={showSuccess}
              onShowError={showError}
            />
            <ValidationPanel validationResult={validationResult} nodeCount={nodes.length} />
            <ToastContainer toasts={toasts} onRemove={removeToast} />
          </>
        }
      />
    </ErrorBoundary>
  );
}

export default App;

