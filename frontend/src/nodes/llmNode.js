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
        <span>LLM</span>
      </div>
      <div className="custom-node-body nodrag">
        
        <select value={model} onChange={handleModelChange} className="custom-node-select" style={{ marginTop: '6px' }}>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="claude-3-opus">Claude 3 Opus</option>
          <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
        </select>

        <textarea 
          ref={textareaRef}
          value={prompt} 
          onChange={handlePromptChange} 
          className="custom-node-textarea"
          placeholder="Enter prompt..."
          style={{ marginTop: '6px', minHeight: '60px', overflow: 'hidden' }}
        />

      </div>
    </BaseNode>
  );
};