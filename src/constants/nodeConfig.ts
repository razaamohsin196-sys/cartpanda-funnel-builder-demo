import { NodeTemplate } from '../types/funnel.types';

export const NODE_TEMPLATES: NodeTemplate[] = [
  {
    type: 'salesPage',
    label: 'Sales Page',
    icon: '📄',
    defaultTitle: 'Sales Page',
    defaultButtonLabel: 'Buy Now',
    color: 'bg-blue-500',
  },
  {
    type: 'orderPage',
    label: 'Order Page',
    icon: '🛒',
    defaultTitle: 'Order Page',
    defaultButtonLabel: 'Complete Order',
    color: 'bg-green-500',
  },
  {
    type: 'upsell',
    label: 'Upsell',
    icon: '⬆️',
    defaultTitle: 'Upsell',
    defaultButtonLabel: 'Add to Order',
    color: 'bg-purple-500',
  },
  {
    type: 'downsell',
    label: 'Downsell',
    icon: '⬇️',
    defaultTitle: 'Downsell',
    defaultButtonLabel: 'Add to Order',
    color: 'bg-orange-500',
  },
  {
    type: 'thankYou',
    label: 'Thank You',
    icon: '✅',
    defaultTitle: 'Thank You',
    defaultButtonLabel: 'Continue',
    color: 'bg-teal-500',
  },
];

