import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeType } from '../../types/funnel.types';
import { getNodeColorWithOpacity } from '../../utils/nodeColors';
import {
  canHaveIncomingConnections,
  canHaveOutgoingConnections,
} from '../../utils/nodeValidation';

interface BaseNodeData {
  title: string;
  buttonLabel: string;
  icon?: string;
  validation?: {
    hasError: boolean;
    hasWarning: boolean;
    errorMessage?: string;
    warningMessage?: string;
  };
}

interface BaseNodeProps extends NodeProps {
  data: BaseNodeData;
  type: NodeType;
}

const BaseNode: React.FC<BaseNodeProps> = ({ data, type }) => {
  const canHaveOutgoing = canHaveOutgoingConnections(type);
  const canHaveIncoming = canHaveIncomingConnections(type);
  const nodeBgColor = getNodeColorWithOpacity(type, 0.1);

  const hasError = data.validation?.hasError ?? false;
  const hasWarning = data.validation?.hasWarning ?? false;
  const errorMessage = data.validation?.errorMessage;
  const warningMessage = data.validation?.warningMessage;

  // Determine border color based on validation state
  const borderColorClass = hasError
    ? 'border-red-500 border-4'
    : hasWarning
    ? 'border-yellow-500 border-2'
    : 'border-gray-300 border-2';

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg ${borderColorClass} bg-white min-w-[180px] relative group`}
      style={{ backgroundColor: nodeBgColor }}
      role="group"
      aria-label={`${data.title} node${hasError ? ' with errors' : hasWarning ? ' with warnings' : ''}`}
      aria-invalid={hasError}
      aria-describedby={(hasError || hasWarning) ? `tooltip-${data.title.replace(/\s+/g, '-')}` : undefined}
      tabIndex={(hasError || hasWarning) ? 0 : undefined}
    >
      {/* Validation warning/error icon */}
      {(hasError || hasWarning) && (
        <div
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md z-10"
          role="status"
          aria-label={hasError ? errorMessage : warningMessage}
        >
          {hasError ? (
            <span className="text-red-600 text-lg" title={errorMessage}>
              ❌
            </span>
          ) : (
            <span className="text-yellow-600 text-lg" title={warningMessage}>
              ⚠️
            </span>
          )}
        </div>
      )}

      {/* Tooltip on hover/focus for validation messages */}
      {(hasError || hasWarning) && (
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
          role="tooltip"
          id={`tooltip-${data.title.replace(/\s+/g, '-')}`}
        >
          {hasError ? errorMessage : warningMessage}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
      {/* Incoming handle */}
      {canHaveIncoming && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
          style={{ top: -6 }}
          aria-label="Connection point for incoming edges"
        />
      )}

      {/* Node content */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-2xl" aria-hidden="true">
          {data.icon || '📄'}
        </div>
        <div className="font-semibold text-sm text-gray-800" role="heading" aria-level={3}>
          {data.title}
        </div>
        <button
          className="px-4 py-1.5 bg-gray-800 text-white text-xs rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`${data.buttonLabel} button for ${data.title}`}
          disabled
          tabIndex={-1}
        >
          {data.buttonLabel}
        </button>
      </div>

      {/* Outgoing handle */}
      {canHaveOutgoing && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
          style={{ bottom: -6 }}
          aria-label="Connection point for outgoing edges"
        />
      )}
    </div>
  );
};

export default BaseNode;

