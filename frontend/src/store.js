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

    const sourceHandles = [
        { side: 'right', x: nodeA.position.x + wA, y: nodeA.position.y + hA / 2 },
        { side: 'bottom', x: nodeA.position.x + wA / 2, y: nodeA.position.y + hA }
    ];

    const targetHandles = [
        { side: 'left', x: nodeB.position.x, y: nodeB.position.y + hB / 2 },
        { side: 'top', x: nodeB.position.x + wB / 2, y: nodeB.position.y }
    ];

    let minDist = Infinity;
    let optimal = ['right', 'left'];

    sourceHandles.forEach(s => {
        targetHandles.forEach(t => {
            const dist = Math.pow(s.x - t.x, 2) + Math.pow(s.y - t.y, 2);
            if (dist < minDist) {
                minDist = dist;
                optimal = [s.side, t.side];
            }
        });
    });

    return optimal;
};

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    isLocked: false,
    past: [],
    future: [],

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

        // Output card can only have one connection
        const targetNode = get().nodes.find(n => n.id === connection.target);
        if (targetNode && targetNode.type === 'customOutput') {
            const hasIncoming = get().edges.some(e => e.target === connection.target);
            if (hasIncoming) return;
        }

        set({
            edges: addEdge({ 
                ...connection, 
                type: 'default',
                style: { strokeWidth: 3, stroke: '#1a1a1a' } 
            }, get().edges),
        });
    },

    disconnectNodeEdges: (nodeId) => {
        get().saveHistory();
        set({
            edges: get().edges.filter(e => e.source !== nodeId && e.target !== nodeId),
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