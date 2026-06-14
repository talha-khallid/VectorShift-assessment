import { useState, useRef, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'deepseek-v4');
  const [prompt, setPrompt] = useState(data?.prompt || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const updateNodeField = useStore(state => state.updateNodeField);
  const textareaRef = useRef(null);

  const models = [
    { value: 'deepseek-v4', label: 'DeepSeek V4' },
    { value: 'deepseek-flash', label: 'DeepSeek Flash' },
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isDropdownOpen]);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    updateNodeField(id, 'prompt', e.target.value);
  };

  return (
    <BaseNode id={id} data={data} defaultTitle="LLM">
      <div className="custom-node-body nodrag">
        <div className="custom-dropdown-container" ref={dropdownRef}>
          <div 
            className={`custom-dropdown-header ${isDropdownOpen ? 'open' : ''}`} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{models.find(m => m.value === model)?.label || model}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          {isDropdownOpen && (
            <div className="custom-dropdown-list">
              {models.map(m => (
                <div 
                  key={m.value}
                  className={`custom-dropdown-item ${m.value === model ? 'selected' : ''}`}
                  onClick={() => { 
                      setModel(m.value); 
                      updateNodeField(id, 'model', m.value);
                      setIsDropdownOpen(false); 
                  }}
                >
                  {m.label}
                </div>
              ))}
            </div>
          )}
        </div>

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