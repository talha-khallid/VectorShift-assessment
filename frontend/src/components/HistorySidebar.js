import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Clock, Database } from 'lucide-react';

export const HistorySidebar = () => {
    const workflowId = useStore(state => state.workflowId);
    const setWorkflowResult = useStore(state => state.setWorkflowResult);
    const [executions, setExecutions] = useState([]);
    
    useEffect(() => {
        if (!workflowId) return;
        setExecutions([]); // Clear executions for new workflow
        
        // Poll or fetch executions
        const fetchExecutions = async () => {
            try {
                const res = await fetch(`http://localhost:8000/workflows/${workflowId}/executions`);
                if (res.ok) {
                    const data = await res.json();
                    setExecutions(data);
                }
            } catch (err) {
                console.error("Failed to load executions", err);
            }
        };
        
        fetchExecutions();
        // Since executions update when runWorkflow completes, we can poll every few seconds for simplicity, 
        // or just rely on a global refresh trigger. A simple interval works well for this scope.
        const interval = setInterval(fetchExecutions, 3000);
        return () => clearInterval(interval);
    }, [workflowId]);

    return (
        <div className="history-sidebar">
            <div className="history-header">
                <Database size={18} />
                <h3>Run History</h3>
            </div>
            <div className="history-list">
                {executions.length === 0 ? (
                    <div className="history-empty">No runs yet</div>
                ) : (
                    executions.map(ex => (
                        <div 
                            key={ex.id} 
                            className="history-item"
                            onClick={() => setWorkflowResult(ex.result)}
                        >
                            <div className="history-item-top">
                                <Clock size={14} />
                                <span>{new Date(ex.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="history-item-preview">
                                {ex.result ? ex.result.substring(0, 40) + '...' : 'No output'}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
