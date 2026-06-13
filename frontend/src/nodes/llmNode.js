// llmNode.js

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const LLMNode = ({ id, data }) => {

  const disconnectNodeEdges = useStore(state => state.disconnectNodeEdges);

  const handleDisconnect = (e) => {
    e.stopPropagation();
    disconnectNodeEdges(id);
  };

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Left} className="hidden-handle" isConnectable={true} />
      <div className="custom-node-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
        </svg>
        <span>LLM</span>
      </div>
      <div className="custom-node-body nodrag" style={{ minHeight: '40px' }}>
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        className="add-handle" 
        onClick={handleDisconnect}
        isConnectable={true}
      />
    </div>
  );
}
