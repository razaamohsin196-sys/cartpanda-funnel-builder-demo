import React from 'react';
import { NODE_TEMPLATES } from '../../constants/nodeConfig';
import PaletteItem from './PaletteItem';
import { ARIA_LABELS } from '../../constants/app.constants';

interface NodePaletteProps {
  onNodeDragStart: (event: React.DragEvent, nodeType: string) => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onNodeDragStart }) => {
  return (
    <aside
      className="w-64 h-full bg-gray-50 border-r border-gray-300 p-4 overflow-y-auto"
      aria-label={ARIA_LABELS.PALETTE}
      role="complementary"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Node Palette</h2>
      <nav className="space-y-2" role="navigation" aria-label="Available node types">
        {NODE_TEMPLATES.map((template) => (
          <PaletteItem
            key={template.type}
            template={template}
            onDragStart={onNodeDragStart}
          />
        ))}
      </nav>
      <div className="mt-6 text-xs text-gray-500" role="note">
        <p>💡 Drag nodes onto the canvas to add them</p>
      </div>
    </aside>
  );
};

export default NodePalette;

