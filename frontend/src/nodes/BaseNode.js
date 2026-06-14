import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const BaseNode = ({ id, children }) => {
  return (
    <div className="custom-node">
      {children}
    </div>
  );
};