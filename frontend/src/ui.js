// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Background } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  isLocked: state.isLocked,
  quickAddMenu: state.quickAddMenu,
  setQuickAddMenu: state.setQuickAddMenu,
});

const QuickAddMenu = ({ menu, reactFlowInstance, closeMenu }) => {
    const { getNodeID, addNode, onConnect } = useStore(state => ({
        getNodeID: state.getNodeID,
        addNode: state.addNode,
        onConnect: state.onConnect
    }), shallow);

    const { useEffect } = require('react');

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.quick-add-menu')) {
                closeMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutside, true);
        return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }, [closeMenu]);

    const addAndConnect = (nodeType) => {
        if (!reactFlowInstance) return;
        
        const nodeID = getNodeID(nodeType);
        const paddingX = menu.type === 'source' ? 250 : -250;
        const position = reactFlowInstance.project({
            x: menu.x + paddingX,
            y: menu.y
        });

        const newNode = {
            id: nodeID,
            type: nodeType,
            position,
            data: { id: nodeID, nodeType }
        };
        addNode(newNode);

        let source, target, sourceHandle, targetHandle;
        if (menu.type === 'source') {
            source = menu.nodeId;
            sourceHandle = menu.handleId;
            target = nodeID;
            if (nodeType === 'llm' || nodeType === 'text') targetHandle = `${nodeID}-input`;
            else if (nodeType === 'customOutput') targetHandle = `${nodeID}-value`;
        } else {
            target = menu.nodeId;
            targetHandle = menu.handleId;
            source = nodeID;
            if (nodeType === 'llm') sourceHandle = `${nodeID}-response`;
            else if (nodeType === 'text') sourceHandle = `${nodeID}-output`;
        }
        
        if (source && target) {
            onConnect({ source, target, sourceHandle, targetHandle });
        }
        closeMenu();
    };

    return (
        <div className="quick-add-menu" style={{ left: menu.x, top: menu.y }}>
            <button className="toolbar-popup-btn" onClick={() => addAndConnect('llm')}>
                <span>LLM</span>
            </button>
            {menu.type === 'source' && (
                <button className="toolbar-popup-btn" onClick={() => addAndConnect('customOutput')}>
                    <span>Output</span>
                </button>
            )}
            <button className="toolbar-popup-btn" onClick={() => addAndConnect('text')}>
                <span>Text</span>
            </button>
        </div>
    );
};

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      isLocked,
      quickAddMenu,
      setQuickAddMenu
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onNodeDragStop = useCallback(() => {
        useStore.getState().saveHistory();
    }, []);

    return (
        <>
        <div ref={reactFlowWrapper} style={{width: '100vw', height: '100vh'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeDragStop={onNodeDragStop}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='default'
                nodesDraggable={!isLocked}
                nodesConnectable={!isLocked}
                elementsSelectable={!isLocked}
            >
                <Background color="#aaa" gap={gridSize} />
            </ReactFlow>
            {quickAddMenu && (
                <QuickAddMenu 
                    menu={quickAddMenu} 
                    reactFlowInstance={reactFlowInstance} 
                    closeMenu={() => setQuickAddMenu(null)} 
                />
            )}
        </div>
        </>
    )
}
