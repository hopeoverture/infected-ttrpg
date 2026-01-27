'use client';

interface MessageNavigationProps {
  isAtBottom: boolean;
  onScrollToBottom: () => void;
  onJumpToLastRoll?: () => void;
  messageCount: number;
  hasUnread?: boolean;
}

export default function MessageNavigation({
  isAtBottom,
  onScrollToBottom,
  onJumpToLastRoll,
  messageCount,
  hasUnread = false
}: MessageNavigationProps) {
  // Don't show if at bottom and no special actions needed
  if (isAtBottom && !hasUnread) {
    return null;
  }

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
      {/* Jump to last roll */}
      {onJumpToLastRoll && (
        <button
          onClick={onJumpToLastRoll}
          className="flex items-center gap-2 px-3 py-2 bg-card border border-subtle rounded-lg shadow-lg hover:border-gold transition-colors text-sm"
          title="Jump to last dice roll"
        >
          <span>🎲</span>
          <span className="hidden sm:inline">Last Roll</span>
        </button>
      )}

      {/* Scroll to bottom */}
      {!isAtBottom && (
        <button
          onClick={onScrollToBottom}
          className="flex items-center gap-2 px-3 py-2 bg-card border border-subtle rounded-lg shadow-lg hover:border-gold transition-colors text-sm relative"
          title="Scroll to latest"
        >
          <span>↓</span>
          <span className="hidden sm:inline">Latest</span>
          
          {/* Unread indicator */}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-pulse" />
          )}
        </button>
      )}

      {/* Message count */}
      <div className="text-xs text-muted text-center">
        {messageCount} messages
      </div>
    </div>
  );
}
