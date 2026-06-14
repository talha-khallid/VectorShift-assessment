import { useState, useRef, useEffect } from 'react';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4');
  const [prompt, setPrompt] = useState(data?.prompt || '');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleModelChange = (e) => {
    setModel(e.target.value);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  return (
    <BaseNode id={id}>
      <div className="custom-node-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
        </svg>
        <span>LLM</span>
      </div>
      <div className="custom-node-body nodrag">
        <label className="custom-node-label" style={{ display: 'block' }}>
          Model
          <select value={model} onChange={handleModelChange} className="custom-node-select" style={{ marginTop: '6px' }}>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3-opus">Claude 3 Opus</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
          </select>
        </label>
        <label className="custom-node-label" style={{ marginTop: '10px', display: 'block' }}>
          Prompt
          <textarea 
            ref={textareaRef}
            value={prompt} 
            onChange={handlePromptChange} 
            className="custom-node-textarea"
            placeholder="Enter prompt..."
            style={{ marginTop: '6px', minHeight: '60px', overflow: 'hidden' }}
          />
        </label>
      </div>
    </BaseNode>
  );
};