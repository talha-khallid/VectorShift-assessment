// outputNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { CustomHandle } from './CustomHandle';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || '');
  const [outputType, setOutputType] = useState(data.outputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
  };

  return (
    <div className="custom-node">
      <div className="hover-zone-left"></div>
      <div className="hover-zone-right"></div>
      <div className="custom-node-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <span>Output</span>
      </div>
      <div className="custom-node-body nodrag">
        <label className="custom-node-label">
          Name
          <input 
            type="text" 
            value={currName} 
            onChange={handleNameChange} 
            className="custom-node-input"
            style={{ marginTop: '6px' }}
          />
        </label>
        <label className="custom-node-label">
          Type
          <select value={outputType} onChange={handleTypeChange} className="custom-node-select" style={{ marginTop: '6px' }}>
            <option value="Text">Text</option>
            <option value="Image">Image</option>
          </select>
        </label>
      </div>
      <CustomHandle
        type="target"
        position={Position.Left}
        id={`${id}-value`}
        nodeId={id}
      />
    </div>
  );
}
