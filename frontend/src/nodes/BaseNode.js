import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Handle, Position } from 'reactflow';

export const BaseNode = ({ id, data, defaultTitle, children }) => {
  const deleteNode = useStore(state => state.deleteNode);
  const updateNodeField = useStore(state => state.updateNodeField);
  const edges = useStore(state => state.edges);
  const disconnectNodeSide = useStore(state => state.disconnectNodeSide);
  const connectingHandle = useStore(state => state.connectingHandle);

  const isOutputNode = id.includes('customOutput') || data?.nodeType === 'customOutput';
  const isOutputConnected = isOutputNode && edges.some(e => e.source === id || e.target === id);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [hoverSide, setHoverSide] = useState(null);
  const menuRef = useRef(null);
  const nodeRef = useRef(null);

  const title = data?.customName || defaultTitle || 'Node';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isMenuOpen]);

  const handleDelete = () => {
    deleteNode(id);
  };

  const handleRenameClick = () => {
    setEditValue(title);
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleConfirmRename = () => {
    if (!editValue.trim()) return;
    updateNodeField(id, 'customName', editValue.trim());
    setIsEditing(false);
  };

  const handleCancelRename = () => {
    setIsEditing(false);
  };

  const handleMouseMove = (e) => {
    if (!nodeRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    const distLeft = Math.abs(x - rect.left);
    const distRight = Math.abs(rect.right - x);
    const distTop = Math.abs(y - rect.top);
    const distBottom = Math.abs(rect.bottom - y);

    const min = Math.min(distLeft, distRight, distTop, distBottom);
    
    let side = null;
    if (min === distLeft) side = 'left';
    else if (min === distRight) side = 'right';
    else if (min === distTop) side = 'top';
    else if (min === distBottom) side = 'bottom';

    setHoverSide(side);
  };

  const handleMouseLeave = () => {
    setHoverSide(null);
  };

  return (
    <div 
      className="custom-node" 
      ref={nodeRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {['top', 'bottom', 'left', 'right'].map(side => {
        const isConnected = edges.some(e => 
            (e.source === id && e.sourceHandle === `${id}-${side}-source`) || 
            (e.target === id && e.targetHandle === `${id}-${side}-target`)
        );

        if (isOutputConnected && !isConnected) {
            return null;
        }

        const isConnecting = connectingHandle === `${id}-${side}-source` || connectingHandle === `${id}-${side}-target`;

        return (
          <div 
            key={side}
            className={`hover-dot-wrapper ${side} nodrag ${isConnected ? 'is-connected' : ''}`}
            onClick={() => {
                if (isConnected) disconnectNodeSide(id, side);
            }}
            style={{ 
              opacity: (hoverSide === side || isConnected || isConnecting) ? 1 : 0, 
            }}
          >
          <Handle 
            type="target" 
            position={side === 'top' ? Position.Top : side === 'bottom' ? Position.Bottom : side === 'left' ? Position.Left : Position.Right} 
            id={`${id}-${side}-target`} 
          />
          <Handle 
            type="source" 
            position={side === 'top' ? Position.Top : side === 'bottom' ? Position.Bottom : side === 'left' ? Position.Left : Position.Right} 
            id={`${id}-${side}-source`} 
          />
        </div>
        );
      })}
      <div className="custom-node-header">
        {isEditing ? (
          <div className="node-rename-container nodrag">
            <input 
              type="text" 
              className="node-rename-input"
              value={editValue} 
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              maxLength={12}
              required
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmRename();
                if (e.key === 'Escape') handleCancelRename();
              }}
            />
            <div className="node-rename-actions">
              <button className="icon-btn tick-btn" onClick={handleConfirmRename} title="Confirm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              <button className="icon-btn cross-btn" onClick={handleCancelRename} title="Cancel">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <>
            <span 
              onDoubleClick={handleRenameClick} 
              title="Double click to rename"
            >
              {title}
            </span>
            <div className="node-menu-container" ref={menuRef}>
              <button className="icon-btn menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} title="Options">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <circle cx="12" cy="5" r="2.5"></circle>
                  <circle cx="12" cy="12" r="2.5"></circle>
                  <circle cx="12" cy="19" r="2.5"></circle>
                </svg>
              </button>
              {isMenuOpen && (
                <div className="node-menu-dropdown">
                  <button className="node-menu-item" onClick={handleRenameClick}>Rename</button>
                  <button className="node-menu-item delete" onClick={handleDelete}>Delete</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {children}
    </div>
  );
};