import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { ReactFlowProvider } from 'reactflow';

function App() {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <PipelineUI />
        <PipelineToolbar />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
