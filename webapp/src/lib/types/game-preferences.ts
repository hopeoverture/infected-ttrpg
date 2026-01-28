// Game Preferences Types
// Settings for customizing game difficulty, themes, and play style

export type Difficulty = 'easy' | 'standard' | 'challenging' | 'brutal';

export type Theme =
  | 'survival' | 'horror' | 'action' | 'mystery'
  | 'psychological' | 'social' | 'exploration' | 'moral-dilemmas'
  | 'body-horror' | 'isolation' | 'trust' | 'hope' | 'redemption';

export type Tone = 'hopeful' | 'balanced' | 'grim' | 'nihilistic';

export interface PlayStyleFocus {
  roleplay: number;  // 0-100
  story: number;     // 0-100
  combat: number;    // 0-100
}

export interface GamePreferences {
  difficulty: Difficulty;
  themes: Theme[];
  playStyle: PlayStyleFocus;
  tone: Tone;
  // Voice settings
  gmVoiceId?: string;  // ElevenLabs voice ID for GM narration
}

export const DEFAULT_PREFERENCES: GamePreferences = {
  difficulty: 'standard',
  themes: ['survival', 'horror'],
  playStyle: { roleplay: 33, story: 34, combat: 33 },
  tone: 'balanced',
  gmVoiceId: 'adam'  // Default GM voice
};

export const DIFFICULTIES: Record<Difficulty, { name: string; description: string }> = {
  'easy': {
    name: 'Survivor',
    description: 'Generous resources, forgiving combat. Focus on story over survival pressure.'
  },
  'standard': {
    name: 'Desperate',
    description: 'Balanced challenge and story. Fair but dangerous world.'
  },
  'challenging': {
    name: 'Doomed',
    description: 'Scarce resources, every mistake costs. Tactical decisions matter.'
  },
  'brutal': {
    name: 'Nightmare',
    description: 'Unforgiving. Death awaits the careless. Only the paranoid survive.'
  }
};

export const THEMES: Record<Theme, { name: string; description: string }> = {
  'survival': {
    name: 'Survival',
    description: 'Resource management, scavenging, staying alive day to day'
  },
  'horror': {
    name: 'Horror',
    description: 'Dread, terror, the unknown lurking in shadows'
  },
  'action': {
    name: 'Action',
    description: 'Combat encounters, chases, tense confrontations'
  },
  'mystery': {
    name: 'Mystery',
    description: 'Uncovering secrets, investigation, piecing together what happened'
  },
  'psychological': {
    name: 'Psychological',
    description: 'Mental strain, paranoia, questioning reality'
  },
  'social': {
    name: 'Social',
    description: 'Relationships, group dynamics, trust and betrayal'
  },
  'exploration': {
    name: 'Exploration',
    description: 'Discovering new places, mapping the changed world'
  },
  'moral-dilemmas': {
    name: 'Moral Dilemmas',
    description: 'Hard choices with no good answers, grey areas'
  },
  'body-horror': {
    name: 'Body Horror',
    description: 'Infection, transformation, the horror of the flesh'
  },
  'isolation': {
    name: 'Isolation',
    description: 'Loneliness, being cut off, finding connection'
  },
  'trust': {
    name: 'Trust',
    description: 'Betrayal, loyalty, forming alliances'
  },
  'hope': {
    name: 'Hope',
    description: 'Finding light in darkness, reasons to keep going'
  },
  'redemption': {
    name: 'Redemption',
    description: 'Second chances, atonement, making things right'
  }
};

export const TONES: Record<Tone, { name: string; description: string }> = {
  'hopeful': {
    name: 'Hopeful',
    description: 'Light in the darkness. Humanity endures. Good can win.'
  },
  'balanced': {
    name: 'Balanced',
    description: 'Moments of hope and despair. Reality is complicated.'
  },
  'grim': {
    name: 'Grim',
    description: 'The world is harsh. Survival costs something. Hope is rare.'
  },
  'nihilistic': {
    name: 'Nihilistic',
    description: 'Everything falls apart. There are no happy endings.'
  }
};
