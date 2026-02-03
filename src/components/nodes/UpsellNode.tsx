import React from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';

const UpsellNode: React.FC<NodeProps> = (props) => {
  return <BaseNode {...props} type="upsell" />;
};

export default UpsellNode;

