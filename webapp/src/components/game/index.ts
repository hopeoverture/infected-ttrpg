// Core game components
export { default as CharacterPanel } from './CharacterPanel';
export { default as GameStatePanel } from './GameStatePanel';
export { default as DiceRoll, DiceRollCompact } from './DiceRoll';
export { default as QuickActions, type QuickActionsRef } from './QuickActions';
export { default as MobileNav, CharacterMiniStatus, type MobileTab } from './MobileNav';
export { default as CombatTracker } from './CombatTracker';
export { default as SceneImage } from './SceneImage';

// Extracted page components (from game/[id]/page.tsx)
export { default as CombatPanel } from './CombatPanel';
export { default as AudioPlayer, MuteButton } from './AudioPlayer';
export { default as MessageHistory } from './MessageHistory';
export { default as ActionInput, type ActionInputRef } from './ActionInput';

// Audio components
export { default as AudioNarration, MuteToggle } from './AudioNarration';

// Modal components
export { default as SettingsPanel, DEFAULT_SETTINGS, type GameSettings } from './SettingsPanel';
export { default as BreakingPointModal } from './BreakingPointModal';
export { default as InfectionCheckModal } from './InfectionCheckModal';
export { default as DeathSceneModal } from './DeathSceneModal';
export { default as KeyboardHelpOverlay } from './KeyboardHelpOverlay';

// Status indicators
export { default as SaveIndicator, type SaveStatus } from './SaveIndicator';
export { default as GMThinkingIndicator } from './GMThinkingIndicator';

// Error handling
export { default as GameErrorBoundary, useGameErrorRecovery } from './GameErrorBoundary';

// Character components
export { default as CharacterPortrait } from './CharacterPortrait';
export { default as GutsSpendingMenu, type GutsUse } from './GutsSpendingMenu';

// Message components
export { default as MessageSkeleton } from './MessageSkeleton';
export { default as MessageNavigation } from './MessageNavigation';
export { default as DiceRollDisplay } from './DiceRollDisplay';
