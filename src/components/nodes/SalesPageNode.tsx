import React from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';

const SalesPageNode: React.FC<NodeProps> = (props) => {
  return <BaseNode {...props} type="salesPage" />;
};

export default SalesPageNode;

