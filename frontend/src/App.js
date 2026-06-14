import { PipelineToolbar } from './toolbar';  
import { PipelineUI } from './ui';  
import { ResultPanel } from './ResultPanel';
import { ReactFlowProvider } from 'reactflow';  
  
function App() {  
  return (  
    <ReactFlowProvider>  
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>  
        <PipelineUI />  
        <PipelineToolbar />  
        <ResultPanel />
      </div>  
    </ReactFlowProvider>  
  );  
}  
  
export default App;