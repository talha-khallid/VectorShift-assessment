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
    <BaseNode id={id} inputs={[{ id: 'input', label: 'value' }]}>
      <div className="custom-node-header">
        <span>Output</span>
      </div>
      <div className="custom-node-body nodrag">
          <input 
            type="text" 
            value={currName} 
            onChange={handleNameChange} 
            className="custom-node-input"
            placeholder="Output name..."
          />
      </div>
    </BaseNode>
  );
};