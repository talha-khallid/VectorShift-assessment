import React, { useCallback } from 'react';
import { getBezierPath, EdgeLabelRenderer, useStore } from 'reactflow';
import { getEdgeParams } from './utils.js';

export default function FloatingEdge({ id, source, target, markerEnd, style, data }) {
  const sourceNode = useStore(useCallback((s) => s.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((s) => s.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) return null;

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sx, sourceY: sy,
    targetX: tx, targetY: ty,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
  });

  const dashed = sourceNode?.type === 'audio' || targetNode?.type === 'audio' || data?.dashed;
  const strokeColor = style?.stroke || '#ccc';

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: strokeColor, strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }}
        strokeDasharray={dashed ? '12 12' : undefined}
      />
      {/* End circles that look like connected node handles */}
      <circle cx={sx} cy={sy} r={6} fill="#fff" stroke={strokeColor} strokeWidth={4} />
      <circle cx={tx} cy={ty} r={6} fill="#fff" stroke={strokeColor} strokeWidth={4} />
    </>
  );
}
