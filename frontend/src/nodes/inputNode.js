// inputNode.js

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || '');
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
  };

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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span>Input</span>
      </div>
      <div className="custom-node-body nodrag">
        <label className="custom-node-label">
          Field Name
          <input 
            type="text" 
            value={currName} 
            onChange={handleNameChange} 
            className="custom-node-input"
            style={{ marginTop: '6px' }}
          />
        </label>
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
