'use client';

export default function GameCardSkeleton() {
  return (
    <div className="game-card animate-pulse">
      {/* Cover image skeleton */}
      <div className="h-32 skeleton" />
      
      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <div className="h-5 skeleton rounded w-3/4 mb-2" />
        
        {/* Character info */}
        <div className="h-4 skeleton rounded w-1/2 mb-1" />
        <div className="h-3 skeleton rounded w-2/3 mb-3" />
        
        {/* Meta info */}
        <div className="flex justify-between items-center mb-3">
          <div className="h-3 skeleton rounded w-20" />
          <div className="h-3 skeleton rounded w-16" />
        </div>
        
        {/* Threat bar */}
        <div className="h-2 skeleton rounded-full w-full" />
      </div>
    </div>
  );
}
