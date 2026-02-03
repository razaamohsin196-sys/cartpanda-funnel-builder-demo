import React from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';

const OrderPageNode: React.FC<NodeProps> = (props) => {
  return <BaseNode {...props} type="orderPage" />;
};

export default OrderPageNode;

