import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';

export const LLMNode = ({ id, data }) => {
  const inputs = [
    { id: 'system', position: Position.Left, style: { top: '33%' }, label: 'system' },
    { id: 'prompt', position: Position.Left, style: { top: '66%' }, label: 'prompt' },
  ];
  const outputs = [
    { id: 'response', position: Position.Right, label: 'response' },
  ];

  return (
    <BaseNode id={id} inputs={inputs} outputs={outputs}>
      <div className="custom-node-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
        </svg>
        <span>LLM</span>
      </div>
      <div className="custom-node-body nodrag" style={{ minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>This is a LLM node.</span>
      </div>
    </BaseNode>
  );
};