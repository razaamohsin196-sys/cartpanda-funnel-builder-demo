import React from 'react';
import { NodeTemplate } from '../../types/funnel.types';
import { ARIA_LABELS } from '../../constants/app.constants';

interface PaletteItemProps {
  template: NodeTemplate;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

const PaletteItem: React.FC<PaletteItemProps> = ({ template, onDragStart }) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, template.type);
  };

  // Note: Keyboard drag-and-drop is complex and not standard.
  // For accessibility, we provide keyboard navigation but drag requires mouse/touch.
  // Screen readers will announce the draggable nature via ARIA labels.

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`p-3 rounded-lg border-2 border-gray-300 cursor-grab active:cursor-grabbing bg-white hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${template.color} bg-opacity-10`}
      role="button"
      tabIndex={0}
      aria-label={ARIA_LABELS.PALETTE_ITEM(template.label)}
      aria-describedby={`palette-item-${template.type}-desc`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          {template.icon}
        </span>
        <span className="font-medium text-gray-800">{template.label}</span>
      </div>
      <span id={`palette-item-${template.type}-desc`} className="sr-only">
        Drag this node to the canvas to add it
      </span>
    </div>
  );
};

export default PaletteItem;

