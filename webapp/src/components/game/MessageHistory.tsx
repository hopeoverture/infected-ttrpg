'use client';

import React, { useRef, useEffect } from 'react';
import { Message } from '@/lib/types';
import DiceRoll from './DiceRoll';
import AudioNarration from './AudioNarration';

interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  currentMessageId: string | null;
}

interface MessageHistoryProps {
  /** Array of game messages */
  messages: Message[];
  /** Whether the GM is currently thinking/loading */
  isLoading: boolean;
  /** Whether audio is muted */
  isMuted: boolean;
  /** Current audio playback state */
  audioState: AudioState;
  /** Callback to toggle audio playback for a message */
  onTogglePlayback: () => void;
  /** Whether to auto-scroll to new messages */
  autoScroll?: boolean;
  className?: string;
}

/**
 * MessageHistory - Displays the narrative message list
 * 
 * Features:
 * - Renders GM, player, and system messages with appropriate styling
 * - Shows dice roll results inline
 * - Audio narration controls for GM messages
 * - Auto-scrolls to new messages
 * - Loading indicator when GM is thinking
 */
export function MessageHistory({
  messages,
  isLoading,
  isMuted,
  audioState,
  onTogglePlayback,
  autoScroll = true,
  className = ''
}: MessageHistoryProps): React.ReactElement {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  return (
    <div className={`message-history flex-1 overflow-y-auto p-4 space-y-4 ${className}`}>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isMuted={isMuted}
          audioState={audioState}
          onTogglePlayback={onTogglePlayback}
        />
      ))}
      
      {isLoading && <ThinkingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  isMuted: boolean;
  audioState: AudioState;
  onTogglePlayback: () => void;
}

function MessageBubble({
  message,
  isMuted,
  audioState,
  onTogglePlayback
}: MessageBubbleProps): React.ReactElement {
  const isCurrentAudio = audioState.currentMessageId === message.id;
  
  return (
    <div className="animate-fade-in">
      <div className={`message ${getMessageClass(message.role)}`}>
        {/* Message Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            {getRoleName(message.role)}
          </span>
          <span className="text-xs text-muted">
            {formatTime(message.timestamp)}
          </span>
        </div>
        
        {/* Message Content */}
        <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
          {message.content}
        </div>
        
        {/* Dice Roll Result */}
        {message.roll && (
          <div className="mt-3">
            <DiceRoll result={message.roll} />
          </div>
        )}
        
        {/* Audio Narration Controls (GM messages only) */}
        {message.role === 'gm' && (
          <div className="mt-3 pt-2 border-t border-subtle">
            <AudioNarration
              messageId={message.id}
              text={message.content}
              isGM={true}
              isMuted={isMuted}
              isPlaying={audioState.isPlaying && isCurrentAudio}
              isLoading={audioState.isLoading && isCurrentAudio}
              isCurrentMessage={isCurrentAudio}
              onTogglePlay={onTogglePlayback}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ThinkingIndicator(): React.ReactElement {
  return (
    <div className="message message-gm animate-pulse">
      <div className="flex items-center gap-2 text-muted">
        <span 
          className="inline-block w-2 h-2 bg-accent rounded-full animate-bounce" 
          style={{ animationDelay: '0ms' }}
        />
        <span 
          className="inline-block w-2 h-2 bg-accent rounded-full animate-bounce" 
          style={{ animationDelay: '150ms' }}
        />
        <span 
          className="inline-block w-2 h-2 bg-accent rounded-full animate-bounce" 
          style={{ animationDelay: '300ms' }}
        />
        <span className="ml-2">The GM is thinking...</span>
      </div>
    </div>
  );
}

function getMessageClass(role: Message['role']): string {
  switch (role) {
    case 'gm':
      return 'message-gm';
    case 'player':
      return 'message-player';
    case 'system':
      return 'message-system';
    default:
      return '';
  }
}

function getRoleName(role: Message['role']): string {
  switch (role) {
    case 'gm':
      return 'Game Master';
    case 'player':
      return 'You';
    case 'system':
      return 'System';
    default:
      return 'Unknown';
  }
}

function formatTime(timestamp: Date): string {
  return timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export default MessageHistory;
