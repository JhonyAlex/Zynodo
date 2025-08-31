
import type { ReactNode } from 'react';
import type { Node, Edge } from '@xyflow/react';

// A suggested next node, containing the data for a new node.
export type SuggestedNode = Pick<NodeData, 'icon' | 'label' | 'description'> & { type?: string };

// Fix: Changed NodeData from an interface to a type to better satisfy generic constraints in @xyflow/react.
export type NodeData = {
  icon: ReactNode;
  label: string;
  description: string;
  suggestedNextNodes?: SuggestedNode[];
};

export interface TemplateNode {
  id: string;
  type?: string;
  data: NodeData;
  position: { x: number; y: number };
}

export interface TemplateEdge {
  id:string;
  source: string;
  target: string;
  animated?: boolean;
  // FIX: Add optional `type` property to allow for custom edge types in templates.
  type?: string;
}

export interface FlowTemplate {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  nodes: TemplateNode[];
  edges: TemplateEdge[];
}

// Explicitly type the custom node
export type CustomNodeType = Node<NodeData>;