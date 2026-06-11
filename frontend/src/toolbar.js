// toolbar.js

import { useState } from 'react';
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

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
                <div className="toolbar-popup">
                    <DraggableNode type='customInput' label='Input' />
                    <DraggableNode type='llm' label='LLM' />
                    <DraggableNode type='customOutput' label='Output' />
                    <DraggableNode type='text' label='Text' />
                </div>
            )}

            <div className="toolbar-group">
                <button className="toolbar-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7v6h6"></path>
                        <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path>
                    </svg>
                </button>
                <div className="toolbar-separator"></div>
                <button className="toolbar-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 7v6h-6"></path>
                        <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"></path>
                    </svg>
                </button>
            </div>

            <div className="toolbar-group">
                <button className="toolbar-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <div className="toolbar-separator"></div>
                <button className="toolbar-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>

            <button className="toolbar-single-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 8V4h4"></path>
                    <path d="M4 16v4h4"></path>
                    <path d="M20 8V4h-4"></path>
                    <path d="M20 16v4h-4"></path>
                </svg>
            </button>

            <button className="toolbar-single-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                </svg>
            </button>
        </div>
    );
};
