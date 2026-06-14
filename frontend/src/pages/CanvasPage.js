import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import { PipelineToolbar } from '../components/ui/PipelineToolbar';  
import { PipelineUI } from '../components/canvas/PipelineCanvas';  
import { ResultPanel } from '../components/ui/ResultPanel';
import { HistorySidebar } from '../components/ui/HistorySidebar';
import { ReactFlowProvider } from 'reactflow';  
import { ArrowLeft, Menu, X } from 'lucide-react';

export const CanvasPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const workflowId = useStore(state => state.workflowId);
    const setWorkflowId = useStore(state => state.setWorkflowId);
    const setNodes = useStore(state => state.setNodes);
    const setEdges = useStore(state => state.setEdges);
    const saveWorkflow = useStore(state => state.saveWorkflow);
    const setWorkflowResult = useStore(state => state.setWorkflowResult);
    const [isLoaded, setIsLoaded] = React.useState(false);
    
    // Auto-save debounce
    const nodes = useStore(state => state.nodes);
    const edges = useStore(state => state.edges);
    
    useEffect(() => {
        if (!workflowId || !isLoaded) return;
        const timer = setTimeout(() => {
            saveWorkflow();
        }, 1500);
        return () => clearTimeout(timer);
    }, [nodes, edges, workflowId, saveWorkflow]);
    
    useEffect(() => {
        setIsLoaded(false);
        setWorkflowId(parseInt(id));
        setNodes([]);
        setEdges([]);
        setWorkflowResult(null);
        
        // Fetch workflow data
        const fetchWorkflow = async () => {
            try {
                const response = await fetch(`http://localhost:8000/workflows/${id}`);
                if (!response.ok) {
                    if (response.status === 404) navigate('/');
                    return;
                }
                const data = await response.json();
                setNodes(data.nodes);
                setEdges(data.edges);
                setIsLoaded(true);
            } catch (err) {
                console.error("Failed to load workflow", err);
            }
        };
        fetchWorkflow();
    }, [id, setWorkflowId, setNodes, setEdges, navigate]);

    return (
        <ReactFlowProvider>  
            <div className="canvas-page-container" style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', display: 'flex' }}>  
                <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
                    <HistorySidebar />
                </div>
                
                {isSidebarOpen && (
                    <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
                )}

                <div style={{ flex: 1, position: 'relative' }}>
                    <div className="canvas-top-nav">
                        <button 
                            className="nav-btn"
                            onClick={() => navigate('/')}
                            title="Back to Dashboard"
                        >
                            <ArrowLeft size={16} /> <span className="hide-on-mobile">Back to Dashboard</span>
                        </button>
                        <button 
                            className="nav-btn mobile-menu-btn"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            title="Toggle History"
                        >
                            {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
                        </button>
                    </div>
                    <PipelineUI />  
                    <PipelineToolbar />  
                    <ResultPanel />
                </div>
            </div>  
        </ReactFlowProvider>  
    );
};
