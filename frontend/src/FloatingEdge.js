import React, { useCallback } from 'react';
import { getBezierPath, useStore } from 'reactflow';
import { getEdgeParams } from './utils.js';

export default function FloatingEdge({ id, source, target, markerEnd, style, data }) {
  const sourceNode = useStore(useCallback((s) => s.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((s) => s.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) return null;

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getBezierPath({
    sourceX: sx, sourceY: sy,
    targetX: tx, targetY: ty,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
  });

  const strokeColor = style?.stroke || '#4b5563'; // Match dark grey from the screenshot
  const strokeWidth = style?.strokeWidth || 3;

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: strokeColor, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }}
      />
      {/* End circles that look like connected node handles */}
      <circle cx={sx} cy={sy} r={6} fill="#fff" stroke={strokeColor} strokeWidth={strokeWidth} />
      <circle cx={tx} cy={ty} r={6} fill="#fff" stroke={strokeColor} strokeWidth={strokeWidth} />
    </>
  );
}
