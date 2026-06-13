import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { Position } from 'reactflow';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setCurrName(value);
    updateNodeField(id, 'inputName', value);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setInputType(value);
    updateNodeField(id, 'inputType', value);
  };

  const outputs = [{ id: 'value', position: Position.Right }];

  return (
    <BaseNode id={id} outputs={outputs}>
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
        <label className="custom-node-label" style={{ marginTop: '8px', display: 'block' }}>
          Type
          <select value={inputType} onChange={handleTypeChange} className="custom-node-select" style={{ marginTop: '6px' }}>
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};