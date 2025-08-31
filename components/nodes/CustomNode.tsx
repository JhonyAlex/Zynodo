

import React, { memo } from 'react';
// FIX: Import `Node` type to use as a generic parameter for `NodeProps`.
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { NodeData } from '../../types';

// FIX: By defining the component as a standalone function with explicit props,
// we help TypeScript correctly infer the types, especially when using generics with
// higher-order components like `memo`. When this is memoized, the resulting
// component has the correct signature for React Flow's `nodeTypes` prop.
// This resolves the errors where `data.icon` and `data.label` were inaccessible
// and fixes the assignment error in App.tsx.
// FIX: Changed NodeProps generic from `NodeData` to `Node<NodeData>` to satisfy the type constraint
// and correctly type the `data` prop as `NodeData`.
const CustomNodeComponent = ({ data, selected }: NodeProps<Node<NodeData>>) => {
  const selectionClass = selected ? 'border-sky-500 ring-2 ring-sky-500/50' : 'border-slate-700';

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-slate-500" />
      <div className={`flex items-center gap-3 p-3 w-64 bg-slate-800 rounded-lg border ${selectionClass} shadow-lg transition-all`}>
        <div className="flex-shrink-0">
            {data.icon}
        </div>
        <div className="flex-1 text-sm font-medium text-slate-200">
            {data.label}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-500" />
    </>
  );
};

CustomNodeComponent.displayName = 'CustomNode';

const CustomNode = memo(CustomNodeComponent);

export default CustomNode;