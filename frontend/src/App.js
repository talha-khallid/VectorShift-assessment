import { PipelineToolbar } from './toolbar';  
import { PipelineUI } from './ui';  
import { SubmitButton } from './submit';
import { ReactFlowProvider } from 'reactflow';  
  
function App() {  
  return (  
    <ReactFlowProvider>  
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>  
        <PipelineUI />  
        <PipelineToolbar />  
        <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 1000 }}>
          <SubmitButton />
        </div>
      </div>  
    </ReactFlowProvider>  
  );  
}  
  
export default App;