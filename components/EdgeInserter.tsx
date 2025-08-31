import React, { useState, useLayoutEffect, useRef, useEffect, useCallback } from 'react';
import { useReactFlow, useStore, type Edge } from '@xyflow/react';
import type { SuggestedNode } from '../types';
import { AVAILABLE_NODES } from '../constants';

interface EdgeInserterProps {
  edge: Edge;
  onInsert: (edge: Edge, suggestion: SuggestedNode) => void;
  onClose: () => void;
}

const EdgeInserter = ({ edge, onInsert, onClose }: EdgeInserterProps) => {
  const [position, setPosition] = useState({ top: -9999, left: -9999 });
  const [canClose, setCanClose] = useState(false); // NUEVO: Estado para controlar cuándo se puede cerrar
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { flowToScreenPosition } = useReactFlow();

  const { sourceNode, targetNode } = useStore(
    useCallback(
      (s: any) => {
        const source = s.nodeInternals?.get(edge.source);
        const target = s.nodeInternals?.get(edge.target);
        return { sourceNode: source, targetNode: target };
      },
      [edge.source, edge.target]
    )
  );

  useLayoutEffect(() => {
    if (sourceNode?.positionAbsolute && targetNode?.positionAbsolute) {
      const centerX = (sourceNode.positionAbsolute.x + (sourceNode.width ?? 0) / 2 + targetNode.positionAbsolute.x + (targetNode.width ?? 0) / 2) / 2;
      const centerY = (sourceNode.positionAbsolute.y + (sourceNode.height ?? 0) / 2 + targetNode.positionAbsolute.y + (targetNode.height ?? 0) / 2) / 2;

      const screenPosition = flowToScreenPosition({ x: centerX, y: centerY });
      
      setPosition({
        top: screenPosition.y,
        left: screenPosition.x,
      });

    } else {
      setPosition({ top: -9999, left: -9999 });
    }
  }, [sourceNode, targetNode, flowToScreenPosition]);

  // NUEVO: Effect para activar canClose después de un retraso
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanClose(true);
    }, 100); // Retraso de 100ms para evitar la condición de carrera
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // MODIFICADO: Solo cerrar si canClose es true
      if (canClose && wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    // MODIFICADO: Solo agregar el listener si canClose es true
    if (canClose) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [onClose, canClose]);

  const handleSelect = (suggestion: SuggestedNode) => {
    onInsert(edge, suggestion);
  };

  if (position.top === -9999) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className="absolute z-30"
      style={{ top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}
    >
      <div className="w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-2 flex flex-col animate-fade-in-up">
        <p className="text-xs text-slate-400 px-2 pb-1 font-semibold">Insertar Nodo:</p>
        <div className="max-h-80 overflow-y-auto pr-1">
          <div className="flex flex-col gap-1">
            {AVAILABLE_NODES.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSelect(suggestion)}
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
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EdgeInserter;