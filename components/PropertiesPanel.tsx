
import React from 'react';
import type { CustomNodeType, SuggestedNode } from '../types';

interface PropertiesPanelProps {
  selectedNode: CustomNodeType | null;
  onUpdateNode: (nodeId: string, newLabel: string) => void;
  onAddSuggestedNode: (sourceNode: CustomNodeType, suggestion: SuggestedNode) => void;
}

const PropertiesPanel = ({ selectedNode, onUpdateNode, onAddSuggestedNode }: PropertiesPanelProps) => {
  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, event.target.value);
    }
  };

  const suggestions = selectedNode?.data?.suggestedNextNodes;

  return (
    <aside className="w-80 bg-slate-900/80 backdrop-blur-sm p-4 border-l border-slate-800">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">Propiedades</h2>
      {selectedNode ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="node-label" className="block text-sm font-medium text-slate-400 mb-1">
              Etiqueta del Nodo
            </label>
            <input
              type="text"
              id="node-label"
              value={selectedNode.data.label}
              onChange={handleLabelChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoComplete="off"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-1">Descripción</h3>
            <p className="text-sm text-slate-300 p-3 bg-slate-800/50 rounded-md border border-slate-700/50">
                {selectedNode.data.description}
            </p>
          </div>

          {suggestions && suggestions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Siguiente Acción</h3>
              <div className="flex flex-col gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onAddSuggestedNode(selectedNode, suggestion)}
                    className="flex items-center gap-3 p-2 w-full text-left rounded-md bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700 hover:border-sky-500 transition-colors"
                  >
                    <div className="flex-shrink-0 w-6 h-6">{suggestion.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-slate-100">{suggestion.label}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{suggestion.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
             <h3 className="text-sm font-medium text-slate-400 mb-1">ID del Nodo</h3>
            <p className="text-xs text-slate-500 break-words">{selectedNode.id}</p>
          </div>
        </div>
      ) : (
        <div className="text-center text-slate-500 mt-10">
          <p>Seleccione un nodo para ver sus propiedades.</p>
        </div>
      )}
    </aside>
  );
};

export default PropertiesPanel;
