import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded bg-slate-800/80 ${className}`}
    />
  );
};

export const TrackRowSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-md text-xs border border-transparent">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Skeleton className="w-5 h-3" />
        <Skeleton className="w-8 h-8 rounded" />
        <div className="space-y-1.5 flex-1 max-w-xs">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>
      <div className="hidden md:flex items-center gap-4 w-1/3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="w-8 h-3" />
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-3 rounded-lg bg-[#0f141d]/80 border border-slate-800 space-y-3">
      <Skeleton className="aspect-square w-full rounded" />
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-2.5 w-1/2" />
      <div className="pt-2 border-t border-slate-800/60 flex justify-between">
        <Skeleton className="h-2.5 w-12" />
        <Skeleton className="h-2.5 w-10" />
      </div>
    </div>
  );
};
