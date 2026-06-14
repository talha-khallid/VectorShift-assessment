import { useState, useRef, useEffect } from 'react';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || '');
  const [outputVal, setOutputVal] = useState(data?.outputVal || '');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [outputVal]);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleOutputValChange = (e) => {
    setOutputVal(e.target.value);
  };

  return (
    <BaseNode id={id}>
      <div className="custom-node-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <span>Output</span>
      </div>
      <div className="custom-node-body nodrag">
        <label className="custom-node-label" style={{ display: 'block' }}>
          Name
          <input 
            type="text" 
            value={currName} 
            onChange={handleNameChange} 
            className="custom-node-input"
            placeholder="Output name..."
            style={{ marginTop: '6px' }}
          />
        </label>
        <label className="custom-node-label" style={{ marginTop: '10px', display: 'block' }}>
          Response
          <textarea 
            ref={textareaRef}
            value={outputVal} 
            onChange={handleOutputValChange} 
            className="custom-node-textarea"
            placeholder="Output response..."
            style={{ marginTop: '6px', minHeight: '60px', overflow: 'hidden' }}
          />
        </label>
      </div>
    </BaseNode>
  );
};