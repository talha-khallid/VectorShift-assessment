import React from 'react';
import { getBezierPath } from 'reactflow';
import { useStore } from './store';

export default function FloatingEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  data,
}) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const deleteEdge = useStore((s) => s.deleteEdge);
  const sourceNode = useStore((s) => s.nodes.find((n) => n.id === source));
  const targetNode = useStore((s) => s.nodes.find((n) => n.id === target));

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteEdge(id);
  };

  const dashed = sourceNode?.type === 'audio' || targetNode?.type === 'audio' || data?.dashed;
  const strokeColor = style?.stroke || '#ccc';

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: strokeColor,
          strokeWidth: 4,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          fill: 'none',
        }}
        strokeDasharray={dashed ? '12 12' : undefined}
      />
      {/* Circle at the start of the connection */}
      <g className="edge-handle-group" onClick={handleDelete}>
        <circle
          cx={sourceX}
          cy={sourceY}
          r={6}
          className="edge-handle-circle"
          fill="#fff"
          stroke={strokeColor}
          strokeWidth={4}
        />
        <circle
          cx={sourceX}
          cy={sourceY}
          r={15}
          fill="transparent"
        />
      </g>
      {/* Circle at the end of the connection */}
      <g className="edge-handle-group" onClick={handleDelete}>
        <circle
          cx={targetX}
          cy={targetY}
          r={6}
          className="edge-handle-circle"
          fill="#fff"
          stroke={strokeColor}
          strokeWidth={4}
        />
        <circle
          cx={targetX}
          cy={targetY}
          r={15}
          fill="transparent"
        />
      </g>
    </>
  );
}