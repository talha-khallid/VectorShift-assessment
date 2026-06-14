import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder } from 'lucide-react';

export const Home = () => {
    const [workflows, setWorkflows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/workflows')
            .then(res => res.json())
            .then(data => setWorkflows(data))
            .catch(err => console.error("Error loading workflows", err));
    }, []);

    const createWorkflow = async () => {
        try {
            const res = await fetch('http://localhost:8000/workflows', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: `Workflow ${workflows.length + 1}` })
            });
            const data = await res.json();
            navigate(`/workflow/${data.id}`);
        } catch (err) {
            console.error("Failed to create workflow", err);
        }
    };

    return (
        <div className="home-dashboard">
            <header className="home-header">
                <div className="home-header-content">
                    <h1>Your Workflows</h1>
                    <button className="create-btn" onClick={createWorkflow}>
                        <Plus size={18} />
                        New Workflow
                    </button>
                </div>
            </header>

            <main className="workflows-grid">
                {workflows.length === 0 ? (
                    <div className="empty-state">
                        <Folder size={48} strokeWidth={1} color="#9ca3af" />
                        <p>No workflows yet. Create one to get started!</p>
                    </div>
                ) : (
                    workflows.map(wf => (
                        <div key={wf.id} className="workflow-card" onClick={() => navigate(`/workflow/${wf.id}`)}>
                            <div className="workflow-card-icon">
                                <Folder size={24} color="#4b5563" />
                            </div>
                            <div className="workflow-card-info">
                                <h3>{wf.name}</h3>
                                <span>Updated: {new Date(wf.updated_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};
