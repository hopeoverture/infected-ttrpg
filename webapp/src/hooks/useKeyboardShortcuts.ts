import { useEffect, useCallback, useState } from 'react';

interface KeyboardShortcutsOptions {
  onSubmit?: () => void;
  onEscape?: () => void;
  onQuickAction?: (index: number) => void;
  onToggleAudio?: () => void;
  onToggleMute?: () => void;
  enabled?: boolean;
}

interface KeyboardShortcutsReturn {
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
}

export function useKeyboardShortcuts({
  onSubmit,
  onEscape,
  onQuickAction,
  onToggleAudio,
  onToggleMute,
  enabled = true
}: KeyboardShortcutsOptions): KeyboardShortcutsReturn {
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const target = event.target as HTMLElement;
    const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

    // Always available shortcuts
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        if (showHelp) {
          setShowHelp(false);
        } else {
          onEscape?.();
        }
        return;

      case '?':
        if (!isInputFocused) {
          event.preventDefault();
          setShowHelp(prev => !prev);
        }
        return;

      case 'F1':
        event.preventDefault();
        setShowHelp(prev => !prev);
        return;
    }

    // Shortcuts that only work when not in an input
    if (!isInputFocused) {
      switch (event.key) {
        case ' ':
          event.preventDefault();
          onToggleAudio?.();
          return;

        case 'm':
        case 'M':
          event.preventDefault();
          onToggleMute?.();
          return;

        // Quick actions 1-6
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          event.preventDefault();
          onQuickAction?.(parseInt(event.key) - 1);
          return;
      }
    }

    // Shortcuts that work in inputs
    if (isInputFocused) {
      switch (event.key) {
        case 'Enter':
          if (!event.shiftKey) {
            event.preventDefault();
            onSubmit?.();
          }
          return;
      }
    }
  }, [enabled, showHelp, onSubmit, onEscape, onQuickAction, onToggleAudio, onToggleMute]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { showHelp, setShowHelp };
}

export default useKeyboardShortcuts;
