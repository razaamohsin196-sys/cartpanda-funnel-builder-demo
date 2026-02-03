import { useMemo } from 'react';
import SalesPageNode from '../components/nodes/SalesPageNode';
import OrderPageNode from '../components/nodes/OrderPageNode';
import UpsellNode from '../components/nodes/UpsellNode';
import DownsellNode from '../components/nodes/DownsellNode';
import ThankYouNode from '../components/nodes/ThankYouNode';

/**
 * Hook to get React Flow node types mapping
 * Memoized to prevent unnecessary re-renders
 */
export const useNodeTypes = () => {
  return useMemo(
    () => ({
      salesPage: SalesPageNode,
      orderPage: OrderPageNode,
      upsell: UpsellNode,
      downsell: DownsellNode,
      thankYou: ThankYouNode,
    }),
    []
  );
};

