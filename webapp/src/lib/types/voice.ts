/**
 * Voice types for multi-voice audio system
 */

// Voice style categories
export type VoiceStyle = 'narrator' | 'dramatic' | 'mysterious' | 'warm' | 'character';

// Voice gender
export type VoiceGender = 'male' | 'female';

// Voice option for display in selector
export interface VoiceOption {
  id: string;           // Voice key (e.g., 'adam', 'rachel')
  elevenLabsId: string; // ElevenLabs API voice ID
  name: string;         // Display name
  description: string;  // Short description
  gender: VoiceGender;
  style: VoiceStyle;
  previewText?: string; // Sample text for preview
}

// Dialog segment for multi-voice narration
export interface DialogSegment {
  speaker: 'gm' | 'player' | 'npc';
  speakerId?: string;   // NPC id when speaker is 'npc'
  speakerName?: string; // Display name for the speaker
  text: string;
  isQuoted: boolean;    // True if this is spoken dialog in quotes
}

// Voice assignment for NPC archetypes
export type NPCVoiceArchetype =
  | 'veteran-male'
  | 'young-male'
  | 'authority-male'
  | 'mysterious-male'
  | 'veteran-female'
  | 'young-female'
  | 'authority-female'
  | 'mysterious-female';

// Curated voice list for the game
// These map to the ELEVENLABS_VOICES in api/tts/route.ts
export const VOICE_OPTIONS: VoiceOption[] = [
  // Male - Narrator style
  {
    id: 'adam',
    elevenLabsId: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    description: 'Deep & clear - ideal for GM narration',
    gender: 'male',
    style: 'narrator'
  },
  {
    id: 'daniel',
    elevenLabsId: 'onwK4e9ZLuTAKqWW03F9',
    name: 'Daniel',
    description: 'Authoritative British accent',
    gender: 'male',
    style: 'narrator'
  },
  // Male - Dramatic style
  {
    id: 'arnold',
    elevenLabsId: 'VR6AewLTigWG4xSOukaG',
    name: 'Arnold',
    description: 'Gravelly & intense',
    gender: 'male',
    style: 'dramatic'
  },
  {
    id: 'clyde',
    elevenLabsId: '2EiwWnXFnvU5JabPnv8n',
    name: 'Clyde',
    description: 'War-worn veteran',
    gender: 'male',
    style: 'dramatic'
  },
  // Male - Mysterious style
  {
    id: 'marcus',
    elevenLabsId: 'pFZP5JQG7iQjIQuC4Bku',
    name: 'Marcus',
    description: 'Thoughtful & measured',
    gender: 'male',
    style: 'mysterious'
  },
  {
    id: 'james',
    elevenLabsId: 'ZQe5CZNOzWyzPSCn5a3c',
    name: 'James',
    description: 'Calm Australian accent',
    gender: 'male',
    style: 'mysterious'
  },
  // Male - Warm style
  {
    id: 'liam',
    elevenLabsId: 'TX3LPaxmHKxFdv7VOQHJ',
    name: 'Liam',
    description: 'Young & earnest',
    gender: 'male',
    style: 'warm'
  },
  {
    id: 'josh',
    elevenLabsId: 'TxGEqnHWrfWFTfGW9XjX',
    name: 'Josh',
    description: 'Deep American voice',
    gender: 'male',
    style: 'warm'
  },
  // Male - Character style
  {
    id: 'callum',
    elevenLabsId: 'N2lVS1w4EtoT3dr4eOWO',
    name: 'Callum',
    description: 'Intense Scottish accent',
    gender: 'male',
    style: 'character'
  },
  {
    id: 'charlie',
    elevenLabsId: 'IKne3meq5aSn9XLyUdCD',
    name: 'Charlie',
    description: 'Casual Australian',
    gender: 'male',
    style: 'character'
  },
  {
    id: 'fin',
    elevenLabsId: 'D38z5RcWu1voky8WS1ja',
    name: 'Fin',
    description: 'Irish storyteller',
    gender: 'male',
    style: 'character'
  },
  // Female - Mysterious style
  {
    id: 'rachel',
    elevenLabsId: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel',
    description: 'Calm & composed',
    gender: 'female',
    style: 'mysterious'
  },
  {
    id: 'sarah',
    elevenLabsId: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Sarah',
    description: 'Soft & intimate',
    gender: 'female',
    style: 'mysterious'
  },
  // Female - Dramatic style
  {
    id: 'domi',
    elevenLabsId: 'AZnzlk1XvdvUeBnXmlld',
    name: 'Domi',
    description: 'Strong & intense',
    gender: 'female',
    style: 'dramatic'
  },
  {
    id: 'bella',
    elevenLabsId: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Bella',
    description: 'Warm narrator voice',
    gender: 'female',
    style: 'dramatic'
  },
  // Female - Narrator style
  {
    id: 'elli',
    elevenLabsId: 'MF3mGyEYCl7XYWbV9V6O',
    name: 'Elli',
    description: 'Clear American accent',
    gender: 'female',
    style: 'narrator'
  },
  {
    id: 'charlotte',
    elevenLabsId: 'XB0fDUnXU5powFXDhCwa',
    name: 'Charlotte',
    description: 'Elegant British accent',
    gender: 'female',
    style: 'narrator'
  },
  // Female - Character style
  {
    id: 'matilda',
    elevenLabsId: 'XrExE9yKIg1WjnnlVkGX',
    name: 'Matilda',
    description: 'Warm Australian accent',
    gender: 'female',
    style: 'character'
  }
];

// Helper to get voice by ID
export function getVoiceById(id: string): VoiceOption | undefined {
  return VOICE_OPTIONS.find(v => v.id === id);
}

// Helper to filter voices by gender
export function getVoicesByGender(gender: VoiceGender): VoiceOption[] {
  return VOICE_OPTIONS.filter(v => v.gender === gender);
}

// Helper to filter voices by style
export function getVoicesByStyle(style: VoiceStyle): VoiceOption[] {
  return VOICE_OPTIONS.filter(v => v.style === style);
}

// Helper to group voices by style
export function getVoicesGroupedByStyle(): Record<VoiceStyle, VoiceOption[]> {
  return VOICE_OPTIONS.reduce((acc, voice) => {
    if (!acc[voice.style]) {
      acc[voice.style] = [];
    }
    acc[voice.style].push(voice);
    return acc;
  }, {} as Record<VoiceStyle, VoiceOption[]>);
}

// Default voices
export const DEFAULT_GM_VOICE = 'adam';
export const DEFAULT_MALE_VOICE = 'josh';
export const DEFAULT_FEMALE_VOICE = 'rachel';

// Voice archetype pools for NPC assignment
export const VOICE_ARCHETYPE_POOLS: Record<NPCVoiceArchetype, string[]> = {
  'veteran-male': ['clyde', 'arnold', 'marcus'],
  'young-male': ['liam', 'charlie', 'josh'],
  'authority-male': ['daniel', 'adam', 'james'],
  'mysterious-male': ['marcus', 'james', 'fin'],
  'veteran-female': ['domi', 'charlotte', 'rachel'],
  'young-female': ['bella', 'elli', 'matilda'],
  'authority-female': ['charlotte', 'domi', 'elli'],
  'mysterious-female': ['rachel', 'sarah', 'bella']
};
