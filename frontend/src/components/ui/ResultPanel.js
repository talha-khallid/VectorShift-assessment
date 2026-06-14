import React from 'react';
import { useStore } from '../../store/store';
import ReactMarkdown from 'react-markdown';

export const ResultPanel = () => {
    const workflowResult = useStore(state => state.workflowResult);
    const setWorkflowResult = useStore(state => state.setWorkflowResult);

    if (!workflowResult) return null;

    return (
        <div className="result-panel-overlay">
            <div className="result-panel">
                <div className="result-header">
                    <h3>Execution Result</h3>
                    <button className="close-btn" onClick={() => setWorkflowResult(null)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="result-content">
                    <ReactMarkdown>{workflowResult}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
