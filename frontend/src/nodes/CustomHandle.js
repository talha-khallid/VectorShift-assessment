import React, { useState } from 'react';
import { Handle } from 'reactflow';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
    edges: state.edges,
    removeEdge: state.removeEdge,
    setQuickAddMenu: state.setQuickAddMenu
});

export const CustomHandle = ({ type, position, id, nodeId, style }) => {
    const { edges, removeEdge, setQuickAddMenu } = useStore(selector, shallow);
    
    // Check if this handle is connected
    const connectedEdge = edges.find(e => 
        (type === 'source' && e.source === nodeId && (e.sourceHandle === id || !e.sourceHandle)) ||
        (type === 'target' && e.target === nodeId && (e.targetHandle === id || !e.targetHandle))
    );
    
    const isConnected = !!connectedEdge;

    const handleClick = (e) => {
        // e.stopPropagation() breaks React Flow dragging! Do not stop propagation.
        if (isConnected) {
            removeEdge(connectedEdge.id);
        } else {
            const rect = e.target.getBoundingClientRect();
            setQuickAddMenu({
                type,
                nodeId,
                handleId: id,
                x: type === 'source' ? rect.right + 10 : rect.left - 130, 
                y: rect.top - 20
            });
        }
    };

    return (
        <Handle
            type={type}
            position={position}
            id={id}
            className={`custom-handle ${isConnected ? 'connected' : 'unconnected'}`}
            style={style}
            onClick={handleClick}
        >
            {isConnected ? (
                <span className="handle-icon">×</span>
            ) : (
                <span className="handle-icon">+</span>
            )}
        </Handle>
    );
};
