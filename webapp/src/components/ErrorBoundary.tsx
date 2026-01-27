'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component that catches JavaScript errors in child components
 * and displays a fallback UI instead of crashing the entire app.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    this.setState({ errorInfo });
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
    
    // In production, you might want to send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onRetry?: () => void;
}

/**
 * Default error fallback UI
 */
export function ErrorFallback({ error, onRetry }: ErrorFallbackProps): React.ReactElement {
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <div 
      className="min-h-[400px] flex items-center justify-center p-8"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="text-6xl mb-4" aria-hidden="true">💀</div>
        
        {/* Title */}
        <h2 className="text-xl font-semibold mb-2 text-primary">
          Something went wrong
        </h2>
        
        {/* Message */}
        <p className="text-secondary mb-6">
          An unexpected error occurred. Don't worry, your progress has been saved.
        </p>
        
        {/* Error details in development */}
        {isDev && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-muted hover:text-secondary transition-colors">
              View error details
            </summary>
            <div className="mt-2 p-3 bg-surface-elevated rounded border border-subtle">
              <p className="text-sm font-mono text-danger break-all">
                {error.name}: {error.message}
              </p>
              {error.stack && (
                <pre className="mt-2 text-xs text-muted overflow-x-auto whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn btn-primary"
              aria-label="Try again"
            >
              🔄 Try Again
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="btn btn-secondary"
            aria-label="Reload the page"
          >
            ↻ Reload Page
          </button>
          <a
            href="/"
            className="btn btn-secondary"
            aria-label="Return to dashboard"
          >
            🏠 Dashboard
          </a>
        </div>
        
        {/* Help text */}
        <p className="mt-6 text-xs text-muted">
          If this keeps happening, try clearing your browser cache or contact support.
        </p>
      </div>
    </div>
  );
}

/**
 * Game-specific error boundary with horror theming
 */
export function GameErrorBoundary({ children }: { children: ReactNode }): React.ReactElement {
  return (
    <ErrorBoundary
      fallback={
        <div 
          className="min-h-screen flex items-center justify-center p-8 bg-surface"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-lg w-full text-center">
            <div className="text-8xl mb-6 animate-pulse" aria-hidden="true">☠️</div>
            
            <h2 className="text-2xl font-bold mb-4 text-danger">
              Connection Lost
            </h2>
            
            <p className="text-secondary mb-2">
              The static grows louder. Something went wrong.
            </p>
            
            <p className="text-muted text-sm mb-8">
              Your character's story has been preserved. The nightmare can continue when you're ready.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary w-full"
                aria-label="Reload and continue playing"
              >
                📻 Tune Back In
              </button>
              
              <a
                href="/"
                className="btn btn-secondary w-full block"
                aria-label="Return to dashboard"
              >
                🏚️ Return to Safety
              </a>
            </div>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        // Log game-specific errors
        console.error('[GAME ERROR]', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
