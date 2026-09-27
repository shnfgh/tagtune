// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React from 'react';

export const FargharSkeletonRow: React.FC = () => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--farghar-glass-bg)' }}>
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg farghar-skeleton flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-4 w-3/4 farghar-skeleton rounded" />
        <div className="h-3 w-1/2 farghar-skeleton rounded" />
      </div>
      <div className="hidden md:flex gap-3 flex-1">
        <div className="h-4 w-24 farghar-skeleton rounded" />
        <div className="h-4 w-20 farghar-skeleton rounded" />
        <div className="h-4 w-16 farghar-skeleton rounded" />
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 farghar-skeleton rounded-lg" />
        <div className="w-8 h-8 farghar-skeleton rounded-lg" />
      </div>
    </div>
  );
};

export const FargharSkeletonLoader: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => <FargharSkeletonRow key={i} />)}
    </div>
  );
};

export const FargharSkeletonCard: React.FC = () => {
  return (
    <div className="farghar-card animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 farghar-skeleton rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-48 farghar-skeleton rounded" />
          <div className="h-4 w-32 farghar-skeleton rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-16 farghar-skeleton rounded" />
            <div className="h-10 w-full farghar-skeleton rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};
