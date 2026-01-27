'use client';

interface MessageSkeletonProps {
  variant?: 'gm' | 'player' | 'system';
}

export default function MessageSkeleton({ variant = 'gm' }: MessageSkeletonProps) {
  const borderClass = variant === 'gm' ? 'border-l-gold' : 
                      variant === 'player' ? 'border-l-info' : 
                      'border-l-muted';

  return (
    <div className={`message animate-pulse border-l-3 ${borderClass}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 skeleton rounded w-20" />
        <div className="h-3 skeleton rounded w-12" />
      </div>
      
      {/* Content lines */}
      <div className="space-y-2">
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-4 skeleton rounded w-11/12" />
        <div className="h-4 skeleton rounded w-4/5" />
        {variant === 'gm' && (
          <>
            <div className="h-4 skeleton rounded w-full mt-4" />
            <div className="h-4 skeleton rounded w-3/4" />
          </>
        )}
      </div>
    </div>
  );
}
