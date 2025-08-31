import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type NodeTypes,
  type EdgeTypes,
  type NodeMouseHandler,
  // Fix: Removed PaneMouseHandler as it's not an exported type from @xyflow/react.
} from '@xyflow/react';
import type { NodeData } from '../types';

interface FlowCanvasProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onDragOver: React.DragEventHandler<HTMLDivElement>;
  onDrop: React.DragEventHandler<HTMLDivElement>;
  nodeTypes: NodeTypes;
  edgeTypes: EdgeTypes;
  onNodeClick: NodeMouseHandler;
  // Fix: Changed prop type to the correct function signature for onPaneClick.
  onPaneClick: (event: React.MouseEvent) => void;
}

const FlowCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDragOver,
  onDrop,
  nodeTypes,
  edgeTypes,
  onNodeClick,
  onPaneClick,
}: FlowCanvasProps) => {
  return (
    <div className="h-full w-full bg-slate-950" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="react-flow-canvas"
      >
        <Controls className="react-flow-controls" />
        <MiniMap nodeStrokeWidth={3} zoomable pannable className="react-flow-minimap"/>
        <Background gap={16} color="#475569" />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;