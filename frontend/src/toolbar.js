// toolbar.js

import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { useReactFlow, useViewport } from 'reactflow';

const selector = (state) => ({
    getNodeID: state.getNodeID,
    addNode: state.addNode,
    nodesCount: state.nodes.length,
    pastCount: state.past.length,
    futureCount: state.future.length,
    undo: state.undo,
    redo: state.redo,
    isLocked: state.isLocked,
    toggleLock: state.toggleLock,
});

export const PipelineToolbar = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { 
        getNodeID, 
        addNode, 
        nodesCount, 
        pastCount, 
        futureCount, 
        undo, 
        redo,
        isLocked,
        toggleLock
    } = useStore(selector, shallow);
    
    const { zoomIn, zoomOut, fitView, project } = useReactFlow();
    const { zoom } = useViewport();
    
    // ReactFlow defaults: minZoom 0.5, maxZoom 2
    const canZoomIn = zoom < 2;
    const canZoomOut = zoom > 0.5;

    const createNode = (type) => {
        setIsPopupOpen(false);
        const nodeID = getNodeID(type);
        
        // Calculate center of screen and project to flow coordinates, add offset based on nodes count
        const offset = (nodesCount % 10) * 20; // reset offset every 10 nodes to avoid going offscreen
        const position = project({
            x: window.innerWidth / 2 - 50 + offset,
            y: window.innerHeight / 2 - 50 + offset,
        });

        const newNode = {
            id: nodeID,
            type,
            position,
            data: { id: nodeID, nodeType: `${type}` },
        };
        addNode(newNode);
    };

    return (
        <div className="toolbar-container">
            <button 
                className="toolbar-btn primary" 
                onClick={() => setIsPopupOpen(!isPopupOpen)}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>

            {isPopupOpen && (
                <div className="toolbar-popup vertical">
                    <button className="toolbar-popup-btn" onClick={() => createNode('customInput')}>Input</button>
                    <button className="toolbar-popup-btn" onClick={() => createNode('llm')}>LLM</button>
                    <button className="toolbar-popup-btn" onClick={() => createNode('customOutput')}>Output</button>
                    <button className="toolbar-popup-btn" onClick={() => createNode('text')}>Text</button>
                </div>
            )}

            <div className="toolbar-group">
                <button 
                    className="toolbar-btn" 
                    onClick={undo}
                    disabled={pastCount === 0}
                    title="Undo"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7v6h6"></path>
                        <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path>
                    </svg>
                </button>
                <div className="toolbar-separator"></div>
                <button 
                    className="toolbar-btn" 
                    onClick={redo}
                    disabled={futureCount === 0}
                    title="Redo"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 7v6h-6"></path>
                        <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"></path>
                    </svg>
                </button>
            </div>

            <div className="toolbar-group">
                <button 
                    className="toolbar-btn" 
                    onClick={() => zoomIn()}
                    disabled={!canZoomIn}
                    title="Zoom In"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <div className="toolbar-separator"></div>
                <button 
                    className="toolbar-btn" 
                    onClick={() => zoomOut()}
                    disabled={!canZoomOut}
                    title="Zoom Out"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>

            <button className="toolbar-single-btn" onClick={() => fitView({ duration: 800 })} title="Fit View">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 8V4h4"></path>
                    <path d="M4 16v4h4"></path>
                    <path d="M20 8V4h-4"></path>
                    <path d="M20 16v4h-4"></path>
                </svg>
            </button>

            <button 
                className={`toolbar-single-btn ${isLocked ? 'active' : ''}`} 
                onClick={toggleLock}
                title={isLocked ? "Unlock" : "Lock"}
            >
                {isLocked ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0110 0v4"></path>
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 019.9-1"></path>
                    </svg>
                )}
            </button>
        </div>
    );
};
