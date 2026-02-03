import { ReactNode } from 'react';

interface FunnelBuilderLayoutProps {
  palette: ReactNode;
  canvas: ReactNode;
}

const FunnelBuilderLayout: React.FC<FunnelBuilderLayoutProps> = ({ palette, canvas }) => {
  return (
    <div className="flex h-screen w-screen" role="application" aria-label="Funnel Builder">
      {palette}
      <div className="flex-1 relative">{canvas}</div>
    </div>
  );
};

export default FunnelBuilderLayout;

