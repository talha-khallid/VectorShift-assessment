import React from 'react';
import { getBezierPath } from 'reactflow';
import { getEdgeParams } from './utils.js';

export default function FloatingConnectionLine({
  fromNode,
  toX,
  toY,
  connectionLineStyle,
}) {
  if (!fromNode) return null;

  // Fake a target node at the mouse position
  const targetNode = {
    id: 'connection-target',
    width: 1,
    height: 1,
    positionAbsolute: { x: toX, y: toY },
  };

  const { sx, sy, sourcePos, targetPos } = getEdgeParams(fromNode, targetNode);

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: toX,
    targetY: toY,
  });

  const strokeColor = connectionLineStyle?.stroke || '#4b5563';
  const strokeWidth = connectionLineStyle?.strokeWidth || 3;

  return (
    <g>
      <path
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        className="animated"
        d={edgePath}
      />
      <circle
        cx={sx}
        cy={sy}
        fill="#fff"
        r={6}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={6}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </g>
  );
}
