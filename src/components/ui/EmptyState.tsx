import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      role="status"
      aria-live="polite"
    >
      <div className="text-center p-8 bg-white bg-opacity-80 rounded-lg shadow-lg max-w-md">
        <div className="text-6xl mb-4" aria-hidden="true">
          🎯
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Building Your Funnel</h3>
        <p className="text-gray-600 text-sm mb-4">
          Drag nodes from the left palette onto the canvas to begin creating your sales funnel.
        </p>
        <div className="flex flex-col gap-2 text-xs text-gray-500">
          <p>💡 <strong>Tip:</strong> Connect nodes by dragging from the bottom handle to another node's top handle</p>
          <p>⌨️ <strong>Shortcut:</strong> Press Delete to remove selected nodes</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;

