import React from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';

const DownsellNode: React.FC<NodeProps> = (props) => {
  return <BaseNode {...props} type="downsell" />;
};

export default DownsellNode;

