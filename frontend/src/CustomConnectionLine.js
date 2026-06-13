import React from 'react';
import { getBezierPath } from 'reactflow';

export default function CustomConnectionLine({
  sourceX,
  sourceY,
  targetX,
  targetY,
}) {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  
  let sourcePosition = 'right';
  let targetPosition = 'left';

  if (Math.abs(dx) > Math.abs(dy)) {
    sourcePosition = dx > 0 ? 'right' : 'left';
    targetPosition = dx > 0 ? 'left' : 'right';
  } else {
    sourcePosition = dy > 0 ? 'bottom' : 'top';
    targetPosition = dy > 0 ? 'top' : 'bottom';
  }

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
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
      <circle cx={sourceX} cy={sourceY} r={6} fill="#fff" stroke={strokeColor} strokeWidth={4} />
      <circle cx={targetX} cy={targetY} r={6} fill="#fff" stroke={strokeColor} strokeWidth={4} />
    </g>
  );
}
