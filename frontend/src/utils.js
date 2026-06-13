import { Position } from 'reactflow';

// Gap between node edge and where the line starts
const GAP = 14;

function getNodeCenter(node) {
  const x = node.positionAbsolute?.x ?? node.position.x;
  const y = node.positionAbsolute?.y ?? node.position.y;
  const w = node.width || 0;
  const h = node.height || 0;
  return { cx: x + w / 2, cy: y + h / 2, x, y, w, h };
}

function getSide(from, to) {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  // Determine which side the line should exit from
  const aspectRatio = from.w / from.h;
  if (absDx / (absDy || 1) > aspectRatio) {
    return dx > 0 ? 'right' : 'left';
  }
  return dy > 0 ? 'bottom' : 'top';
}

function getAnchor(node, side) {
  const { cx, cy, x, y, w, h } = getNodeCenter(node);
  switch (side) {
    case 'top':    return { ax: cx, ay: y - GAP };
    case 'bottom': return { ax: cx, ay: y + h + GAP };
    case 'left':   return { ax: x - GAP, ay: cy };
    case 'right':  return { ax: x + w + GAP, ay: cy };
    default:       return { ax: cx, ay: cy };
  }
}

const sideToPos = {
  top: Position.Top,
  bottom: Position.Bottom,
  left: Position.Left,
  right: Position.Right,
};

export function getEdgeParams(source, target) {
  const srcCenter = getNodeCenter(source);
  const tgtCenter = getNodeCenter(target);

  const srcSide = getSide(srcCenter, tgtCenter);
  const tgtSide = getSide(tgtCenter, srcCenter);

  const src = getAnchor(source, srcSide);
  const tgt = getAnchor(target, tgtSide);

  return {
    sx: src.ax,
    sy: src.ay,
    tx: tgt.ax,
    ty: tgt.ay,
    sourcePos: sideToPos[srcSide],
    targetPos: sideToPos[tgtSide],
  };
}
