import React from 'react';
import { ValidationResult } from '../../utils/nodeValidation';

interface ValidationPanelProps {
  validationResult: ValidationResult;
  nodeCount?: number;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({ validationResult, nodeCount = 0 }) => {
  const { errors, warnings, isValid } = validationResult;

  // Don't show validation panel if canvas is empty
  if (nodeCount === 0) {
    return null;
  }

  if (isValid && warnings.length === 0) {
    return (
      <div
        className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-green-200 p-4 max-w-sm z-10"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-green-700">
          <span className="text-lg" aria-hidden="true">✅</span>
          <span className="font-semibold text-sm">Funnel is valid</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-300 p-4 max-w-sm z-10 max-h-96 overflow-y-auto"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <h3 className="font-semibold text-gray-800 mb-3 text-sm">Validation Status</h3>

      {errors.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-600 text-lg">❌</span>
            <span className="font-semibold text-red-700 text-sm">Errors ({errors.length})</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs text-red-600">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-600 text-lg">⚠️</span>
            <span className="font-semibold text-yellow-700 text-sm">Warnings ({warnings.length})</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs text-yellow-600">
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ValidationPanel;

