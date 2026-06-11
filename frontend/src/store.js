// store.js

import { create } from "zustand";
import {
    applyNodeChanges,
} from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    nodeIDs: {},
    isLocked: false,
    past: [],
    future: [],

    saveHistory: () => {
        set(state => {
            const newPast = [...state.past, { nodes: state.nodes }];
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
                future: [{ nodes: state.nodes }, ...state.future],
                nodes: previous.nodes,
            };
        });
    },

    redo: () => {
        set(state => {
            if (state.future.length === 0) return state;
            const next = state.future[0];
            const newFuture = state.future.slice(1);
            return {
                past: [...state.past, { nodes: state.nodes }],
                future: newFuture,
                nodes: next.nodes,
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
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
        get().saveHistory();
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    node.data = { ...node.data, [fieldName]: fieldValue };
                }
                return node;
            }),
        });
    },
}));
