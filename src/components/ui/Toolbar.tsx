import React, { useRef } from 'react';
import { Node, Edge } from 'reactflow';
import {
  downloadFunnelAsFile,
  readFunnelFromFile,
  FunnelData,
} from '../../utils/funnelPersistence';

interface ToolbarProps {
  nodes: Node[];
  edges: Edge[];
  nodeCounters: { upsell: number; downsell: number };
  onSave: () => void;
  onLoad: () => void;
  onImport: (funnelData: FunnelData) => void;
  hasStoredFunnel: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onShowSuccess: (message: string) => void;
  onShowError: (message: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  nodes,
  edges,
  nodeCounters,
  onSave,
  onLoad,
  onImport,
  hasStoredFunnel,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onShowSuccess,
  onShowError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      downloadFunnelAsFile(nodes, edges, nodeCounters);
      onShowSuccess('Funnel exported successfully!');
    } catch (error) {
      onShowError(error instanceof Error ? error.message : 'Failed to export funnel');
    }
  };

  const handleSave = () => {
    try {
      onSave();
      onShowSuccess('Funnel saved to browser storage!');
    } catch (error) {
      onShowError(error instanceof Error ? error.message : 'Failed to save funnel');
    }
  };

  const handleLoad = () => {
    try {
      onLoad();
      onShowSuccess('Funnel loaded from browser storage!');
    } catch (error) {
      onShowError(error instanceof Error ? error.message : 'Failed to load funnel');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const funnelData = await readFunnelFromFile(file);
      onImport(funnelData);
      onShowSuccess('Funnel imported successfully!');
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      onShowError(error instanceof Error ? error.message : 'Failed to import funnel');
    }
  };

  return (
    <div className="absolute top-4 left-4 z-20 bg-white rounded-lg shadow-lg border border-gray-300 p-2 flex gap-2 flex-wrap">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`px-3 py-2 text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          canUndo
            ? 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        aria-label="Undo last action"
        title="Undo (Ctrl+Z)"
      >
        ↶ Undo
      </button>

      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`px-3 py-2 text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          canRedo
            ? 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        aria-label="Redo last action"
        title="Redo (Ctrl+Shift+Z)"
      >
        ↷ Redo
      </button>

      <div className="w-px bg-gray-300 mx-1"></div>

      <button
        onClick={handleSave}
        className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Save funnel to browser storage"
        title="Save to localStorage"
      >
        💾 Save
      </button>

      <button
        onClick={handleLoad}
        disabled={!hasStoredFunnel}
        className={`px-3 py-2 text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          hasStoredFunnel
            ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        aria-label="Load funnel from browser storage"
        title={hasStoredFunnel ? 'Load from localStorage' : 'No saved funnel found'}
      >
        📂 Load
      </button>

      <button
        onClick={handleExport}
        className="px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        aria-label="Export funnel as JSON file"
        title="Export as JSON"
      >
        📤 Export
      </button>

      <button
        onClick={handleImportClick}
        className="px-3 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        aria-label="Import funnel from JSON file"
        title="Import from JSON"
      >
        📥 Import
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Select JSON file to import"
      />
    </div>
  );
};

export default Toolbar;

