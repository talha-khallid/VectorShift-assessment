import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const BaseNode = ({ id, children }) => {
  const disconnectNodeEdges = useStore(state => state.disconnectNodeEdges);

  const handleDisconnect = (e) => {
    e.stopPropagation();
    disconnectNodeEdges(id);
  };

  const positions = [
    { pos: Position.Top, className: 'handle-wrapper-top' },
    { pos: Position.Bottom, className: 'handle-wrapper-bottom' },
    { pos: Position.Left, className: 'handle-wrapper-left' },
    { pos: Position.Right, className: 'handle-wrapper-right' },
  ];

  return (
    <div className="custom-node">
      {positions.map(({ pos, className }) => (
        <div key={pos} className={`handle-wrapper ${className}`}>
          <Handle type="target" position={pos} className="hidden-target" isConnectable={true} id={`${id}-${pos}-target`} />
          <Handle 
            type="source" 
            position={pos} 
            className="add-handle" 
            onClick={handleDisconnect}
            isConnectable={true}
            id={`${id}-${pos}-source`}
          />
        </div>
      ))}
      {children}
    </div>
  );
};
