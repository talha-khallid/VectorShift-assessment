// toolbar.js

import { useState, useRef, useEffect } from 'react';
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
    const popupRef = useRef(null);
    const btnRef = useRef(null);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popupRef.current && !popupRef.current.contains(event.target) &&
                btnRef.current && !btnRef.current.contains(event.target)
            ) {
                setIsPopupOpen(false);
            }
        };

        if (isPopupOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopupOpen]);

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
                ref={btnRef}
                className="toolbar-btn primary" 
                onClick={() => setIsPopupOpen(!isPopupOpen)}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>

            {isPopupOpen && (
                <div className="toolbar-popup vertical" ref={popupRef}>
                    <button className="toolbar-popup-btn" onClick={() => createNode('customInput')}>
                        <span>Input</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </button>
                    <button className="toolbar-popup-btn" onClick={() => createNode('llm')}>
                        <span>LLM</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                            <line x1="6" y1="6" x2="6.01" y2="6"></line>
                            <line x1="6" y1="18" x2="6.01" y2="18"></line>
                        </svg>
                    </button>
                    <button className="toolbar-popup-btn" onClick={() => createNode('customOutput')}>
                        <span>Output</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                    </button>
                    <button className="toolbar-popup-btn" onClick={() => createNode('text')}>
                        <span>Text</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="4 7 4 4 20 4 20 7"></polyline>
                            <line x1="9" y1="20" x2="15" y2="20"></line>
                            <line x1="12" y1="4" x2="12" y2="20"></line>
                        </svg>
                    </button>
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
