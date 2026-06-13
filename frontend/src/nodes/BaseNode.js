import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const BaseNode = ({ id, children, inputs, outputs }) => {
  const edges = useStore(state => state.edges);
  const disconnectNodeEdges = useStore(state => state.disconnectNodeEdges);

  const handleDisconnect = (e) => {
    e.stopPropagation();
    disconnectNodeEdges(id);
  };

  const isHandleConnected = (handleId) => {
    return edges.some(edge => 
      edge.sourceHandle === handleId || edge.targetHandle === handleId
    );
  };

  // If inputs and outputs are undefined, fall back to the 4-cardinal-sides layout
  const useFallback = inputs === undefined && outputs === undefined;

  const renderHandle = (type, handle) => {
    const handleId = `${id}-${handle.id}-${type}`;
    const connected = isHandleConnected(handleId);
    const position = handle.position || (type === 'target' ? Position.Left : Position.Right);
    
    // Determine wrapper style based on position
    let wrapperStyle = {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    };

    if (position === Position.Left) {
      wrapperStyle.left = '-15px';
      wrapperStyle.top = handle.style?.top || '50%';
      wrapperStyle.transform = 'translateY(-50%)';
      wrapperStyle.width = '30px';
      wrapperStyle.height = '30px';
    } else if (position === Position.Right) {
      wrapperStyle.right = '-15px';
      wrapperStyle.top = handle.style?.top || '50%';
      wrapperStyle.transform = 'translateY(-50%)';
      wrapperStyle.width = '30px';
      wrapperStyle.height = '30px';
    } else if (position === Position.Top) {
      wrapperStyle.top = '-15px';
      wrapperStyle.left = handle.style?.left || '50%';
      wrapperStyle.transform = 'translateX(-50%)';
      wrapperStyle.width = '30px';
      wrapperStyle.height = '30px';
    } else if (position === Position.Bottom) {
      wrapperStyle.bottom = '-15px';
      wrapperStyle.left = handle.style?.left || '50%';
      wrapperStyle.transform = 'translateX(-50%)';
      wrapperStyle.width = '30px';
      wrapperStyle.height = '30px';
    }

    return (
      <div key={handle.id} style={wrapperStyle} className="handle-wrapper">
        {type === 'target' && (
          <Handle
            type="target"
            position={position}
            id={handleId}
            className="hidden-target"
            isConnectable={true}
          />
        )}
        <Handle
          type={type}
          position={position}
          id={handleId}
          className={`add-handle ${connected ? 'connected' : ''}`}
          isConnectable={true}
          style={{
            ...handle.style,
          }}
        />
        {handle.label && (
          <span 
            style={{
              position: 'absolute',
              fontSize: '10px',
              color: '#666',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              ...(position === Position.Left ? { left: '25px' } : {}),
              ...(position === Position.Right ? { right: '25px' } : {}),
              ...(position === Position.Top ? { top: '25px' } : {}),
              ...(position === Position.Bottom ? { bottom: '25px' } : {}),
            }}
          >
            {handle.label}
          </span>
        )}
      </div>
    );
  };

  const positions = [
    { pos: Position.Top, className: 'handle-wrapper-top' },
    { pos: Position.Bottom, className: 'handle-wrapper-bottom' },
    { pos: Position.Left, className: 'handle-wrapper-left' },
    { pos: Position.Right, className: 'handle-wrapper-right' },
  ];

  return (
    <div className="custom-node">
      {useFallback ? (
        positions.map(({ pos, className }) => {
          const isTargetConnected = isHandleConnected(`${id}-${pos}-target`);
          const isSourceConnected = isHandleConnected(`${id}-${pos}-source`);
          return (
            <div key={pos} className={`handle-wrapper ${className}`}>
              <Handle 
                type="target" 
                position={pos} 
                className="hidden-target" 
                isConnectable={true} 
                id={`${id}-${pos}-target`} 
              />
              <Handle 
                type="source" 
                position={pos} 
                className={`add-handle ${isSourceConnected || isTargetConnected ? 'connected' : ''}`} 
                onClick={handleDisconnect}
                isConnectable={true}
                id={`${id}-${pos}-source`}
              />
            </div>
          );
        })
      ) : (
        <>
          {(inputs || []).map(input => renderHandle('target', input))}
          {(outputs || []).map(output => renderHandle('source', output))}
        </>
      )}
      {children}
    </div>
  );
};