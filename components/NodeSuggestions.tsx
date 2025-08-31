import React, { useState, useLayoutEffect, useRef, useEffect, useCallback } from 'react';
import { useReactFlow, useStore, type Node } from '@xyflow/react';
import type { CustomNodeType, SuggestedNode } from '../types';

interface NodeSuggestionsProps {
  selectedNode: CustomNodeType;
  onAddNode: (sourceNode: CustomNodeType, suggestion: SuggestedNode) => void;
}

const NodeSuggestions = ({ selectedNode, onAddNode }: NodeSuggestionsProps) => {
  const [position, setPosition] = useState({ top: -9999, left: -9999 });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { flowToScreenPosition } = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // FIX: The `nodeInternals` property is not exposed on the `ReactFlowState` type
  // in some library versions. Casting the state object `s` to `any` bypasses this
  // TypeScript error, allowing access to the internal state at runtime, which is
  // assumed to exist.
  const currentNode = useStore(
    useCallback((s: any) => s.nodeInternals?.get(selectedNode.id), [selectedNode.id])
  );

  useLayoutEffect(() => {
    // We now use `currentNode` which is guaranteed to be up-to-date from the store.
    if (currentNode?.width && currentNode?.height) {
      const nodePosition = {
        x: currentNode.position.x + currentNode.width / 2,
        y: currentNode.position.y + currentNode.height,
      };
      const screenPosition = flowToScreenPosition(nodePosition);
      setPosition({
        top: screenPosition.y + 12, // 12px below the node
        left: screenPosition.x,
      });
    } else {
        setPosition({ top: -9999, left: -9999 });
    }
    
    // Reset popover state when selection changes
    setPopoverOpen(false);

  }, [currentNode, flowToScreenPosition]);

  // Handle clicks outside the component to close the popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // FIX: Resolved a type collision between React Flow's `Node` type and the DOM's `Node` type.
      // `event.target` is a DOM element, so it should be cast to the DOM's `Node` type (`globalThis.Node`)
      // for the `.contains()` method, not the `Node` type imported from `@xyflow/react`.
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as globalThis.Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleAddClick = (suggestion: SuggestedNode) => {
    onAddNode(selectedNode, suggestion);
    setPopoverOpen(false);
  };

  const suggestions = currentNode?.data?.suggestedNextNodes;

  if (!currentNode || !suggestions || suggestions.length === 0 || position.top === -9999) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className="absolute z-20"
      style={{ top: position.top, left: position.left, transform: 'translateX(-50%)' }}
    >
      <button
        onClick={() => setPopoverOpen(p => !p)}
        className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white hover:bg-sky-400 transition-all duration-200 shadow-lg transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-sky-500"
        aria-label="Añadir siguiente paso"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {popoverOpen && (
        <div className="absolute bottom-full mb-3 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-2 flex flex-col gap-1 transform -translate-x-1/2 left-1/2 animate-fade-in-up">
          <p className="text-xs text-slate-400 px-2 pb-1 font-semibold">Siguiente Acción Sugerida:</p>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleAddClick(suggestion)}
              className="flex items-center gap-3 p-2 w-full text-left rounded-md hover:bg-slate-700 transition-colors"
            >
              <div className="flex-shrink-0 w-6 h-6">{suggestion.icon}</div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-slate-100">{suggestion.label}</h4>
                <p className="text-xs text-slate-400 line-clamp-1">{suggestion.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px) translateX(-50%); }
            to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NodeSuggestions;
