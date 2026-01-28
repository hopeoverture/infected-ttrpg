'use client';

import React, { useRef, useImperativeHandle, forwardRef, FormEvent } from 'react';
import QuickActions, { QuickActionsRef } from './QuickActions';
import { GameState } from '@/lib/types';

interface ActionInputProps {
  /** Current input value */
  value: string;
  /** Callback when input value changes */
  onChange: (value: string) => void;
  /** Callback when action is submitted */
  onSubmit: (action: string) => void;
  /** Current game state for quick actions */
  gameState: GameState;
  /** Whether input is disabled (e.g., during loading) */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum number of quick actions to show */
  maxQuickActions?: number;
  className?: string;
}

export interface ActionInputRef {
  focus: () => void;
  clear: () => void;
  setValue: (value: string) => void;
  triggerQuickAction: (index: number) => void;
}

/**
 * ActionInput - Player input area with quick actions
 * 
 * Features:
 * - Text input for player actions
 * - Quick action buttons based on game context
 * - Submit on Enter key
 * - Ref methods for external control
 */
export const ActionInput = forwardRef<ActionInputRef, ActionInputProps>(
  function ActionInput(
    {
      value,
      onChange,
      onSubmit,
      gameState,
      disabled = false,
      placeholder = 'What do you do?',
      maxQuickActions = 6,
      className = ''
    },
    ref
  ): React.ReactElement {
    const inputRef = useRef<HTMLInputElement>(null);
    const quickActionsRef = useRef<QuickActionsRef>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => onChange(''),
      setValue: (newValue: string) => onChange(newValue),
      triggerQuickAction: (index: number) => quickActionsRef.current?.triggerAction(index)
    }));

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit(value);
      }
    };

    const handleQuickAction = (action: string) => {
      onSubmit(action);
    };

    return (
      <div className={`action-input border-t border-subtle p-4 flex-shrink-0 ${className}`}>
        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mb-3">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="input flex-1"
              disabled={disabled}
              aria-label="Player action input"
            />
            <button 
              type="submit" 
              disabled={disabled || !value.trim()}
              className="btn btn-primary disabled:opacity-50"
              aria-label="Submit action"
            >
              ➤
            </button>
          </div>
        </form>

        {/* Quick Actions - Desktop */}
        <div className="hidden md:block" role="group" aria-label="Quick actions">
          <QuickActions
            ref={quickActionsRef}
            gameState={gameState}
            onAction={handleQuickAction}
            disabled={disabled}
            maxActions={maxQuickActions}
          />
        </div>
        
        {/* Quick Actions - Mobile (fewer options) */}
        <div className="md:hidden" role="group" aria-label="Quick actions">
          <QuickActions
            gameState={gameState}
            onAction={handleQuickAction}
            disabled={disabled}
            maxActions={4}
          />
        </div>
      </div>
    );
  }
);

export default ActionInput;
