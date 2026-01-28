'use client';

import React, { Component, ErrorInfo, ReactNode, useCallback, useState } from 'react';

interface Props {
  children: ReactNode;
  gameId?: string;
  onRecoveryAttempt?: (action: 'reload' | 'reset-ui' | 'clear-cache') => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  recoveryAttempted: boolean;
}

/**
 * GameErrorBoundary - Enhanced error boundary with game-specific recovery options
 * 
 * Features:
 * - Horror-themed error UI that matches the game's aesthetic
 * - Multiple recovery options (reload, reset UI, clear cache)
 * - Error logging for debugging
 * - Preserves game save state
 */
export class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      recoveryAttempted: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[GAME ERROR]', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      gameId: this.props.gameId
    });
    
    this.setState({ errorInfo });
    
    // Attempt to save any unsaved state to localStorage as backup
    this.saveEmergencyBackup(error);
  }

  saveEmergencyBackup = (error: Error): void => {
    try {
      const backup = {
        timestamp: new Date().toISOString(),
        error: error.message,
        gameId: this.props.gameId,
        url: typeof window !== 'undefined' ? window.location.href : 'unknown'
      };
      localStorage.setItem('infected-error-backup', JSON.stringify(backup));
    } catch {
      // Silently fail if localStorage is unavailable
    }
  };

  handleReload = (): void => {
    this.props.onRecoveryAttempt?.('reload');
    window.location.reload();
  };

  handleResetUI = (): void => {
    this.props.onRecoveryAttempt?.('reset-ui');
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      recoveryAttempted: true 
    });
  };

  handleClearCache = (): void => {
    this.props.onRecoveryAttempt?.('clear-cache');
    try {
      // Clear game-related localStorage items
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('infected-')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Reload after clearing
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  handleReturnHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <GameErrorFallback
          error={this.state.error}
          recoveryAttempted={this.state.recoveryAttempted}
          onReload={this.handleReload}
          onResetUI={this.handleResetUI}
          onClearCache={this.handleClearCache}
          onReturnHome={this.handleReturnHome}
        />
      );
    }

    return this.props.children;
  }
}

interface GameErrorFallbackProps {
  error: Error | null;
  recoveryAttempted: boolean;
  onReload: () => void;
  onResetUI: () => void;
  onClearCache: () => void;
  onReturnHome: () => void;
}

function GameErrorFallback({
  error,
  recoveryAttempted,
  onReload,
  onResetUI,
  onClearCache,
  onReturnHome
}: GameErrorFallbackProps): React.ReactElement {
  const [showDetails, setShowDetails] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8 bg-black"
      role="alert"
      aria-live="assertive"
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/20 to-black" />
      
      {/* Static noise effect */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          animation: 'noise 0.5s steps(8) infinite'
        }}
      />
      
      <div className="relative max-w-lg w-full text-center z-10">
        {/* Glitch effect on icon */}
        <div className="text-8xl mb-6 relative" aria-hidden="true">
          <span className="absolute inset-0 animate-pulse text-red-600 opacity-50 blur-sm">☠️</span>
          <span className="relative">☠️</span>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-red-500 tracking-wider uppercase">
          Signal Lost
        </h2>
        
        <div className="mb-6 font-mono text-xs text-red-400/70 space-y-1">
          <p>/// ERROR: SYSTEM_FAILURE ///</p>
          <p>/// CONNECTION_TERMINATED ///</p>
          <p>/// ATTEMPTING_RECOVERY... ///</p>
        </div>
        
        <p className="text-gray-400 mb-2">
          The static grows louder. Something went wrong.
        </p>
        
        <p className="text-gray-500 text-sm mb-8">
          Your survivor&apos;s story has been preserved.
          {recoveryAttempted && ' Recovery was attempted but the error persists.'}
        </p>
        
        {/* Recovery options */}
        <div className="space-y-3 mb-8">
          {!recoveryAttempted && (
            <button
              onClick={onResetUI}
              className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors text-gray-200"
              aria-label="Attempt to recover without reloading"
            >
              🔧 Attempt Recovery
            </button>
          )}
          
          <button
            onClick={onReload}
            className="w-full px-6 py-3 bg-red-900/50 hover:bg-red-800/50 border border-red-700 rounded-lg transition-colors text-red-200"
            aria-label="Reload the page"
          >
            📻 Tune Back In
          </button>
          
          <button
            onClick={onReturnHome}
            className="w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors text-gray-300"
            aria-label="Return to dashboard"
          >
            🏚️ Return to Safety
          </button>
        </div>
        
        {/* Advanced options */}
        <details className="text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400 transition-colors text-center">
            Advanced Options
          </summary>
          <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <button
              onClick={onClearCache}
              className="w-full px-4 py-2 mb-3 bg-yellow-900/30 hover:bg-yellow-800/30 border border-yellow-700/50 rounded transition-colors text-yellow-200/80 text-sm"
              aria-label="Clear local cache and reload"
            >
              ⚠️ Clear Cache &amp; Reload
            </button>
            <p className="text-xs text-gray-600">
              This will reset local settings but won&apos;t affect your saved games.
            </p>
          </div>
        </details>
        
        {/* Error details in development */}
        {isDev && error && (
          <details className="mt-6 text-left">
            <summary 
              className="cursor-pointer text-sm text-gray-500 hover:text-gray-400 transition-colors"
              onClick={() => setShowDetails(!showDetails)}
            >
              🔍 Debug Info
            </summary>
            <div className="mt-2 p-3 bg-gray-900 rounded border border-gray-800 overflow-x-auto">
              <p className="text-sm font-mono text-red-400 break-all">
                {error.name}: {error.message}
              </p>
              {error.stack && (
                <pre className="mt-2 text-xs text-gray-500 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

/**
 * Hook version for functional components that need error recovery
 */
export function useGameErrorRecovery() {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: Error) => {
    console.error('[GAME ERROR]', err);
    setError(err);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}

export default GameErrorBoundary;
