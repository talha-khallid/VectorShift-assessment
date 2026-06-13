import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { Position } from 'reactflow';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setCurrName(value);
    updateNodeField(id, 'outputName', value);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setOutputType(value);
    updateNodeField(id, 'outputType', value);
  };

  const inputs = [{ id: 'value', position: Position.Left }];

  return (
    <BaseNode id={id} inputs={inputs}>
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
        <label className="custom-node-label" style={{ marginTop: '8px', display: 'block' }}>
          Type
          <select value={outputType} onChange={handleTypeChange} className="custom-node-select" style={{ marginTop: '6px' }}>
            <option value="Text">Text</option>
            <option value="Image">Image</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};