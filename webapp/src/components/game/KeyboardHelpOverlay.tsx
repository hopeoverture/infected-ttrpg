'use client';

interface KeyboardHelpOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  title: string;
  shortcuts: { keys: string[]; description: string }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['Enter'], description: 'Submit your action' },
      { keys: ['Esc'], description: 'Clear input / Close modals' },
      { keys: ['?', 'F1'], description: 'Show this help' }
    ]
  },
  {
    title: 'Quick Actions',
    shortcuts: [
      { keys: ['1'], description: 'First quick action' },
      { keys: ['2'], description: 'Second quick action' },
      { keys: ['3'], description: 'Third quick action' },
      { keys: ['4'], description: 'Fourth quick action' },
      { keys: ['5'], description: 'Fifth quick action' },
      { keys: ['6'], description: 'Sixth quick action' }
    ]
  },
  {
    title: 'Audio',
    shortcuts: [
      { keys: ['Space'], description: 'Play / Pause narration' },
      { keys: ['M'], description: 'Toggle mute' }
    ]
  }
];

export default function KeyboardHelpOverlay({ isOpen, onClose }: KeyboardHelpOverlayProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={(e) => e.key && onClose()}
      role="dialog"
      aria-label="Keyboard shortcuts"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Content */}
      <div 
        className="relative z-10 w-full max-w-xl mx-4 bg-surface border border-subtle rounded-lg shadow-xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-subtle">
          <h2 className="text-xl font-bold">⌨️ Keyboard Shortcuts</h2>
          <button 
            onClick={onClose}
            className="text-muted hover:text-primary transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Shortcuts */}
        <div className="p-4 space-y-6 max-h-[60vh] overflow-y-auto">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-secondary">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, j) => (
                        <span key={j}>
                          {j > 0 && <span className="text-muted mx-1">or</span>}
                          <kbd className="px-2 py-1 bg-card border border-medium rounded text-sm font-mono">
                            {key}
                          </kbd>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-subtle text-center text-sm text-muted">
          Press any key or click outside to close
        </div>
      </div>
    </div>
  );
}
