import React from 'react';
import { getBezierPath } from 'reactflow';

export default function CustomConnectionLine({
  fromX,
  fromY,
  fromPosition,
  toX,
  toY,
  toPosition,
}) {
  const [edgePath] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition || 'left', // Fallback to avoid error when dragging in empty canvas
  });

  const strokeColor = '#ccc';

  return (
    <g>
      <path
        fill="none"
        stroke={strokeColor}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        d={edgePath}
      />
      <circle cx={fromX} cy={fromY} r={6} fill="#fff" stroke={strokeColor} strokeWidth={4} />
      <circle cx={toX} cy={toY} r={6} fill="#fff" stroke={strokeColor} strokeWidth={4} />
    </g>
  );
}