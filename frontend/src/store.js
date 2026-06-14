import { create } from "zustand";
import {
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    MarkerType,
} from 'reactflow';

const getOptimalHandles = (nodeA, nodeB) => {
    const wA = nodeA.width || 350; const hA = nodeA.height || 150;
    const wB = nodeB.width || 350; const hB = nodeB.height || 150;

    const cxA = nodeA.position.x + wA / 2;
    const cyA = nodeA.position.y + hA / 2;
    const cxB = nodeB.position.x + wB / 2;
    const cyB = nodeB.position.y + hB / 2;

    const dx = cxB - cxA;
    const dy = cyB - cyA;

    if (Math.abs(dx) > Math.abs(dy)) {
        return dx > 0 ? ['right', 'left'] : ['left', 'right'];
    } else {
        return dy > 0 ? ['bottom', 'top'] : ['top', 'bottom'];
    }
};

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    connectingHandle: null,
    workflowResult: null,
    isExecuting: false,
    
    setWorkflowResult: (result) => set({ workflowResult: result }),
    setIsExecuting: (status) => set({ isExecuting: status }),

    nodeIDs: {},
    isLocked: false,
    past: [],
    future: [],

    setConnectingHandle: (handleId) => set({ connectingHandle: handleId }),

    saveHistory: () => {
        set(state => {
            const newPast = [...state.past, { nodes: state.nodes, edges: state.edges }];
            if (newPast.length > 50) newPast.shift();
            return { past: newPast, future: [] };
        });
    },

    undo: () => {
        set(state => {
            if (state.past.length === 0) return state;
            const previous = state.past[state.past.length - 1];
            const newPast = state.past.slice(0, state.past.length - 1);
            return {
                past: newPast,
                future: [{ nodes: state.nodes, edges: state.edges }, ...state.future],
                nodes: previous.nodes,
                edges: previous.edges,
            };
        });
    },

    redo: () => {
        set(state => {
            if (state.future.length === 0) return state;
            const next = state.future[0];
            const newFuture = state.future.slice(1);
            return {
                past: [...state.past, { nodes: state.nodes, edges: state.edges }],
                future: newFuture,
                nodes: next.nodes,
                edges: next.edges,
            };
        });
    },

    toggleLock: () => {
        set(state => ({ isLocked: !state.isLocked }));
    },

    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },

    addNode: (node) => {
        get().saveHistory();
        set({
            nodes: [...get().nodes, node]
        });
    },

    onNodesChange: (changes) => {
        const hasRemove = changes.some(c => c.type === 'remove');
        if (hasRemove) {
            get().saveHistory();
        }
        
        const newNodes = applyNodeChanges(changes, get().nodes);
        let newEdges = get().edges;

        const positionChanges = changes.filter(c => c.type === 'position' && c.dragging);
        if (positionChanges.length > 0) {
            newEdges = newEdges.map(edge => {
                const sourceNode = newNodes.find(n => n.id === edge.source);
                const targetNode = newNodes.find(n => n.id === edge.target);
                if (sourceNode && targetNode) {
                    const [sourceSide, targetSide] = getOptimalHandles(sourceNode, targetNode);
                    return {
                        ...edge,
                        sourceHandle: `${sourceNode.id}-${sourceSide}-source`,
                        targetHandle: `${targetNode.id}-${targetSide}-target`
                    };
                }
                return edge;
            });
        }

        set({
            nodes: newNodes,
            edges: newEdges
        });
    },

    updateNodeField: (nodeId, fieldName, fieldValue) => {
        get().saveHistory();
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            [fieldName]: fieldValue,
                        },
                    };
                }
                return node;
            }),
        });
    },

    onEdgesChange: (changes) => {
        const hasRemove = changes.some(c => c.type === 'remove');
        if (hasRemove) {
            get().saveHistory();
        }
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },

    onConnect: (connection) => {
        get().saveHistory();
        
        // Prevent self connection
        if (connection.source === connection.target) return;

        // Two cards can only be connected once
        const alreadyConnected = get().edges.some(e => 
            (e.source === connection.source && e.target === connection.target) || 
            (e.source === connection.target && e.target === connection.source)
        );
        if (alreadyConnected) return;

        // Output card can only have one connection total
        const sourceNode = get().nodes.find(n => n.id === connection.source);
        const targetNode = get().nodes.find(n => n.id === connection.target);
        
        const isOutputConnected = (nodeId) => get().edges.some(e => e.source === nodeId || e.target === nodeId);
        
        if (sourceNode?.type === 'customOutput' && isOutputConnected(sourceNode.id)) return;
        if (targetNode?.type === 'customOutput' && isOutputConnected(targetNode.id)) return;

        set({
            edges: addEdge({ 
                ...connection, 
                type: 'default',
                style: { strokeWidth: 3, stroke: '#1a1a1a', zIndex: 11 } 
            }, get().edges),
        });
    },

    disconnectNodeEdges: (nodeId) => {
        get().saveHistory();
        set({
            edges: get().edges.filter(e => e.source !== nodeId && e.target !== nodeId),
        });
    },

    disconnectNodeSide: (nodeId, side) => {
        get().saveHistory();
        set({
            edges: get().edges.filter(e => 
                !(e.source === nodeId && e.sourceHandle === `${nodeId}-${side}-source`) &&
                !(e.target === nodeId && e.targetHandle === `${nodeId}-${side}-target`)
            ),
        });
    },

    deleteEdge: (edgeId) => {
        get().saveHistory();
        set({
            edges: get().edges.filter(e => e.id !== edgeId),
        });
    },

    deleteNode: (nodeId) => {
        get().saveHistory();
        set({
            nodes: get().nodes.filter(n => n.id !== nodeId),
            edges: get().edges.filter(e => e.source !== nodeId && e.target !== nodeId),
        });
    },
}));