// textNode.js

import { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);

  // Parse variables from text
  useEffect(() => {
    const regex = /\{\{([\w\s]+)\}\}/g;
    const matches = [...currText.matchAll(regex)];
    const vars = matches.map(m => m[1].trim()).filter((v, i, a) => a.indexOf(v) === i); // unique variables
    setVariables(vars);
  }, [currText]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currText]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  return (
    <div className="custom-node">
      <div className="custom-node-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        <span>Text Input</span>
      </div>
      <div className="custom-node-body nodrag">
        <label className="custom-node-label">
          Describe the requirements
          <textarea 
            ref={textareaRef}
            value={currText} 
            onChange={handleTextChange} 
            className="custom-node-textarea"
            style={{ marginTop: '6px', minHeight: '60px', overflow: 'hidden' }}
          />
        </label>
      </div>

      {variables.map((variable, index) => {
        // Calculate the top position dynamically to distribute handles evenly
        const topPosition = variables.length === 1 ? 50 : 20 + (60 / (variables.length - 1)) * index;
        return (
          <Handle
            key={`${id}-${variable}`}
            type="target"
            position={Position.Left}
            id={`${id}-${variable}`}
            style={{ top: `${topPosition}%` }}
            className="custom-handle"
          />
        );
      })}

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className="custom-handle"
      />
    </div>
  );
}
