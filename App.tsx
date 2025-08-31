

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  useStore,
  Node,
  Edge,
  Connection,
} from '@xyflow/react';
// Fix: Import Node type with generic placeholder for correct typing.
import type { CustomNodeType, NodeData, SuggestedNode } from './types';
import { TEMPLATES, DEFAULT_SUGGESTIONS, AVAILABLE_NODES } from './constants';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PropertiesPanel from './components/PropertiesPanel';
import FlowCanvas from './components/FlowCanvas';
import CustomNode from './components/nodes/CustomNode';
import NodeSuggestions from './components/NodeSuggestions';
import CustomEdge from './components/edges/CustomEdge';
import EdgeInserter from './components/EdgeInserter';


let instanceCounter = 0;
const getNewInstanceId = () => `instance_${instanceCounter++}`;

let nodeIdCounter = 100; // Start high to avoid conflicts with template IDs
const getNewNodeId = () => `node_${nodeIdCounter++}`;


const FlowDesigner = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  // Fix: The generic for useNodesState should be a Node type, not the data type within the node.
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<CustomNodeType | null>(null);
  const [edgeForInsertion, setEdgeForInsertion] = useState<Edge | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  
  const edgeTypes = useMemo(() => ({
    custom: (props: any) => <CustomEdge {...props} onInsertClick={setEdgeForInsertion} />,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);


  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, type: 'custom', animated: true }, eds)), [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const templateId = event.dataTransfer.getData('application/reactflow');
      const nodeId = event.dataTransfer.getData('application/nodepicker');

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (templateId) {
        const template = TEMPLATES.find((t) => t.id === templateId);
        if (!template) return;

        const instanceId = getNewInstanceId();

        const newNodes: CustomNodeType[] = template.nodes.map((node) => ({
          ...node,
          id: `${instanceId}::${node.id}`,
          position: {
            x: position.x + node.position.x,
            y: position.y + node.position.y,
          },
        }));

        const newEdges: Edge[] = template.edges.map((edge) => ({
          ...edge,
          id: `${instanceId}::${edge.id}`,
          source: `${instanceId}::${edge.source}`,
          target: `${instanceId}::${edge.target}`,
          type: 'custom',
        }));

        setNodes((nds) => [...nds, ...newNodes]);
        setEdges((eds) => [...eds, ...newEdges]);

      } else if (nodeId) {
        const nodeData = AVAILABLE_NODES.find(n => n.id === nodeId);
        if (!nodeData) {
            return;
        }

        const newNodeId = getNewNodeId();
        const newNode: CustomNodeType = {
          id: newNodeId,
          type: 'custom',
          position,
          data: {
            icon: nodeData.icon,
            label: nodeData.label,
            description: nodeData.description,
            suggestedNextNodes: DEFAULT_SUGGESTIONS,
          },
        };
        setNodes((nds) => [...nds, newNode]);
      }
    },
    [screenToFlowPosition, setNodes, setEdges]
  );
  
  // FIX: The 'node' parameter from onNodeClick is a generic 'Node' type.
  // It's cast to 'CustomNodeType' to ensure the 'data' property matches
  // the expected 'NodeData' shape for use in components like PropertiesPanel.
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as CustomNodeType);
    setEdgeForInsertion(null); // Close edge inserter when a node is clicked
  }, []);
  
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setEdgeForInsertion(null); // Close edge inserter on pane click
  }, []);

  const updateNodeLabel = (nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              // FIX: Correctly spread the node's existing data (`node.data`) instead of the entire node object (`node`).
              // Spreading the whole node object was causing a type mismatch because it nests the node properties
              // (like id, position) inside the `data` property, which should only contain `NodeData`.
              ...node.data,
              label: newLabel,
            },
          };
        }
        return node;
      })
    );
     if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode(prev => prev ? ({ ...prev, data: { ...prev.data, label: newLabel } }) : null);
    }
  };

  const addSuggestedNode = useCallback((sourceNode: CustomNodeType, suggestion: SuggestedNode) => {
    const newNodeId = getNewNodeId();
    const newNode: CustomNodeType = {
      id: newNodeId,
      type: 'custom',
      position: {
        x: sourceNode.position.x + (sourceNode.width ? (sourceNode.width - 256) / 2 : 0), // Center new node under source
        y: sourceNode.position.y + (sourceNode.height || 0) + 75, // Position below the source
      },
      data: {
        ...suggestion,
        // Ensure newly created nodes also have default suggestions
        suggestedNextNodes: DEFAULT_SUGGESTIONS,
      },
    };

    const newEdge: Edge = {
      id: `e-${sourceNode.id}-${newNodeId}`,
      source: sourceNode.id,
      target: newNodeId,
      animated: true,
      type: 'custom',
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  }, [setNodes, setEdges]);

  const insertNodeBetween = useCallback((edge: Edge, suggestion: SuggestedNode) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) return;

    const newNodeId = getNewNodeId();
    
    // Position the new node at the midpoint between the source and target nodes
    const newNodeX = (sourceNode.position.x + targetNode.position.x) / 2;
    const newNodeY = (sourceNode.position.y + targetNode.position.y) / 2;


    const newNode: CustomNodeType = {
      id: newNodeId,
      type: 'custom',
      position: { x: newNodeX, y: newNodeY },
      data: {
        ...suggestion,
        suggestedNextNodes: DEFAULT_SUGGESTIONS,
      },
    };

    const edgeToNew: Edge = {
      id: `e-${edge.source}-${newNodeId}`,
      source: edge.source,
      target: newNodeId,
      animated: true,
      type: 'custom',
    };
    
    const edgeFromNew: Edge = {
      id: `e-${newNodeId}-${edge.target}`,
      source: newNodeId,
      target: edge.target,
      animated: true,
      type: 'custom',
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds.filter(e => e.id !== edge.id), edgeToNew, edgeFromNew]);
    setEdgeForInsertion(null); // Close the inserter
  }, [nodes, setNodes, setEdges]);


  return (
    <div className="flex flex-col h-screen font-sans text-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar templates={TEMPLATES} />
        <main className="flex-1 relative" ref={reactFlowWrapper}>
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
          />
           {selectedNode && !edgeForInsertion && (
            <NodeSuggestions
              selectedNode={selectedNode}
              onAddNode={addSuggestedNode}
            />
          )}
          {edgeForInsertion && (
            <EdgeInserter 
              edge={edgeForInsertion} 
              onInsert={insertNodeBetween} 
              onClose={() => setEdgeForInsertion(null)} 
            />
          )}
        </main>
        <PropertiesPanel
          selectedNode={selectedNode}
          onUpdateNode={updateNodeLabel}
          onAddSuggestedNode={addSuggestedNode}
        />
      </div>
    </div>
  );
};


const App = () => (
  <ReactFlowProvider>
    <FlowDesigner />
  </ReactFlowProvider>
);

export default App;