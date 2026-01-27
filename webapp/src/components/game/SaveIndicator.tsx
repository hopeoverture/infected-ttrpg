'use client';

import { useEffect, useState } from 'react';

export type SaveStatus = 'saved' | 'saving' | 'offline' | 'error';

interface SaveIndicatorProps {
  status: SaveStatus;
  lastSaved?: Date;
  className?: string;
}

export default function SaveIndicator({ status, lastSaved, className = '' }: SaveIndicatorProps) {
  const [showSaved, setShowSaved] = useState(false);

  // Show "Saved" briefly then fade - intentional UI feedback pattern
  useEffect(() => {
    if (status === 'saved') {
      setShowSaved(true); // eslint-disable-line react-hooks/set-state-in-effect
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [status, lastSaved]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex items-center gap-2 text-xs ${className}`}>
      {status === 'saving' && (
        <>
          <div className="w-3 h-3 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-muted">Saving...</span>
        </>
      )}

      {status === 'saved' && showSaved && (
        <div className="flex items-center gap-1 text-success animate-fade-in">
          <span>✓</span>
          <span>Saved</span>
        </div>
      )}

      {status === 'saved' && !showSaved && lastSaved && (
        <span className="text-muted opacity-60">
          Last saved {formatTime(lastSaved)}
        </span>
      )}

      {status === 'offline' && (
        <div className="flex items-center gap-1 text-warning">
          <span>⚠</span>
          <span>Offline</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-1 text-danger">
          <span>✗</span>
          <span>Save failed</span>
        </div>
      )}
    </div>
  );
}
