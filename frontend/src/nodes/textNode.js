import { useState, useRef, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { Position } from 'reactflow';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '');
  const textareaRef = useRef(null);
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currText]);

  const handleTextChange = (e) => {
    const value = e.target.value;
    setCurrText(value);
    updateNodeField(id, 'text', value);
  };

  // Extract variables of form {{ variableName }}
  const getVariables = (text) => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  };

  const variables = getVariables(currText);

  const inputs = variables.map((v, i) => ({
    id: v,
    position: Position.Left,
    label: v,
    style: {
      top: `${((i + 1) * 100) / (variables.length + 1)}%`,
    },
  }));

  const outputs = [{ id: 'output', position: Position.Right }];

  return (
    <BaseNode id={id} inputs={inputs} outputs={outputs}>
      <div className="custom-node-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"></path>
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
    </BaseNode>
  );
};