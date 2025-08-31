import React, { useState } from 'react';
import type { FlowTemplate, SuggestedNode } from '../types';
import { AVAILABLE_NODES } from '../constants';

interface SidebarProps {
  templates: FlowTemplate[];
}

const TemplateCard = ({ template }: { template: FlowTemplate }) => {
  const onDragStart = (event: React.DragEvent, templateId: string) => {
    event.dataTransfer.setData('application/reactflow', templateId);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onDragStart={(event) => onDragStart(event, template.id)}
      draggable
      className="p-3 border border-slate-700 bg-slate-800 rounded-lg cursor-grab active:cursor-grabbing hover:border-sky-500 hover:bg-slate-700/50 transition-all duration-150"
    >
      <div className="flex items-center gap-3">
        {template.icon}
        <div className="flex-1">
          <h3 className="font-semibold text-slate-100">{template.title}</h3>
          <p className="text-xs text-slate-400">{template.description}</p>
        </div>
      </div>
    </div>
  );
};

const NodeCard = ({ node }: { node: SuggestedNode & { id: string } }) => {
  const onDragStart = (event: React.DragEvent, nodeId: string) => {
    event.dataTransfer.setData('application/nodepicker', nodeId);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
     <div
      onDragStart={(event) => onDragStart(event, node.id)}
      draggable
      className="p-3 border border-slate-700 bg-slate-800 rounded-lg cursor-grab active:cursor-grabbing hover:border-sky-500 hover:bg-slate-700/50 transition-all duration-150"
    >
      <div className="flex items-center gap-3">
        {node.icon}
        <div className="flex-1">
          <h3 className="font-semibold text-slate-100">{node.label}</h3>
          <p className="text-xs text-slate-400 line-clamp-2">{node.description}</p>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ templates }: SidebarProps) => {
  const [activeTab, setActiveTab] = useState('templates');

  const TabButton = ({ id, children }: { id: string, children: React.ReactNode }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors focus:outline-none ${
          isActive
            ? 'bg-sky-500/20 text-sky-400'
            : 'text-slate-400 hover:bg-slate-800'
        }`}
      >
        {children}
      </button>
    );
  };

  return (
    <aside className="w-72 bg-slate-900/80 backdrop-blur-sm p-4 border-r border-slate-800 flex flex-col gap-4">
      <div className="flex p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <TabButton id="templates">Plantillas</TabButton>
        <TabButton id="nodes">Nodos</TabButton>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto pr-1">
        {activeTab === 'templates' && templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
        {activeTab === 'nodes' && AVAILABLE_NODES.map((node) => (
          <NodeCard key={node.id} node={node} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;