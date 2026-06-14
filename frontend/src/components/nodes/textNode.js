import { useState, useRef, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../../store/store';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '');
  const updateNodeField = useStore(state => state.updateNodeField);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currText]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
    updateNodeField(id, 'text', e.target.value);
  };

  return (
    <BaseNode id={id} data={data} defaultTitle="Input">
      <div className="custom-node-body nodrag">
        <textarea 
          ref={textareaRef}
          value={currText} 
          onChange={handleTextChange} 
          className="custom-node-textarea"
          placeholder="Type here..."
          style={{ width: '100%', minHeight: '60px', overflow: 'hidden' }}
        />
      </div>
    </BaseNode>
  );
}
