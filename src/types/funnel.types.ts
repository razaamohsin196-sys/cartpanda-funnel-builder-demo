export type NodeType = 'salesPage' | 'orderPage' | 'upsell' | 'downsell' | 'thankYou';

export interface FunnelNodeData {
  title: string;
  buttonLabel: string;
  icon?: string;
  validation?: NodeValidationState;
}

export interface NodeValidationState {
  hasError: boolean;
  hasWarning: boolean;
  errorMessage?: string;
  warningMessage?: string;
}

export interface NodeTemplate {
  type: NodeType;
  label: string;
  icon: string;
  defaultTitle: string;
  defaultButtonLabel: string;
  color: string;
}

