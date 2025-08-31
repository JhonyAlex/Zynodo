import React, { useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import type { Edge } from '@xyflow/react';

interface CustomEdgeProps extends EdgeProps {
  onInsertClick: (edge: Edge) => void;
}

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  source,
  target,
  onInsertClick,
}: CustomEdgeProps) => {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const handleDelete = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setEdges((es) => es.filter((e) => e.id !== id));
  };
  
  const handleInsert = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    onInsertClick({ id, source, target });
  };

  return (
    <g onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <path
        d={edgePath}
        fill="none"
        strokeOpacity="0"
        strokeWidth={20}
        className="cursor-pointer"
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: isHovered ? 'all' : 'none',
          }}
          className="nodrag nopan"
        >
            <div className={`flex items-center gap-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                 <button
                    onClick={handleInsert}
                    className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white hover:bg-sky-400 transition-all duration-200 shadow-lg transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-sky-500"
                    aria-label="Añadir paso intermedio"
                    title="Añadir paso"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v12m6-6H6" />
                    </svg>
                </button>
                 <button
                    onClick={handleDelete}
                    className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-lg transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-red-500"
                    aria-label="Eliminar conexión"
                    title="Eliminar conexión"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
      </EdgeLabelRenderer>
    </g>
  );
};

export default CustomEdge;
