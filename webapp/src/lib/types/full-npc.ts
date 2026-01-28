// Full NPC Types
// Complete NPC with stats, equipment, personality, and relationship tracking

import { Attributes, Skills, Wounds, Weapon, Armor, Item } from '../types';

export interface NPCPersonality {
  traits: string[];       // e.g., ["cautious", "protective", "cynical"]
  fears: string[];        // e.g., ["being abandoned", "the dark"]
  motivations: string[];  // e.g., ["find family", "protect the group"]
  quirks: string[];       // e.g., ["hums when nervous", "always checks exits"]
}

export type AttitudeLevel = 'hostile' | 'suspicious' | 'neutral' | 'friendly' | 'trusted';

export interface NPCAttitude {
  level: AttitudeLevel;
  score: number;          // -100 to 100 for nuanced tracking
  reasons: string[];      // Why they feel this way about the player
}

export type NPCStatus = 'healthy' | 'wounded' | 'critical' | 'infected' | 'turned' | 'dead';

export interface NPCFirstMet {
  day: number;
  location: string;
  circumstances: string;
}

export interface NPCSignificantEvent {
  day: number;
  description: string;
  impactOnRelationship: number;  // -20 to +20
}

export interface FullNPC {
  id: string;
  name: string;
  nickname?: string;

  // Basic info
  role: string;           // e.g., "Former paramedic", "Local mechanic"
  age: string;            // e.g., "mid-30s", "elderly", "young adult"
  appearance: string;     // Physical description

  // Stats (like player characters)
  attributes: Attributes;
  skills: Partial<Skills>;  // NPCs don't need all skills
  wounds: Wounds;
  stress: number;
  maxStress: number;

  // Equipment
  weapons: Weapon[];
  armor: Armor | null;
  inventory: Item[];

  // Personality & behavior
  personality: NPCPersonality;

  // Relationship with player
  attitude: NPCAttitude;

  // Story elements
  secrets: string[];        // Hidden info GM can reveal
  backstory: string;        // Their history before the outbreak
  currentGoals: string[];   // What they're trying to accomplish

  // Status
  isAlive: boolean;
  status: NPCStatus;
  statusDetails?: string;   // e.g., "broken arm", "feverish"

  // History with player
  firstMet: NPCFirstMet;
  significantEvents: NPCSignificantEvent[];

  // Generation metadata
  isGenerated: boolean;
  generatedFrom?: 'scenario' | 'encounter' | 'player_bond';

  // Voice settings for multi-voice audio
  voiceId?: string;
}

// For party display - subset of FullNPC for quick rendering
export interface NPCDisplayInfo {
  id: string;
  name: string;
  nickname?: string;
  role: string;
  attitude: NPCAttitude;
  status: NPCStatus;
  isAlive: boolean;
  wounds: {
    hasBleeding: boolean;
    hasBroken: boolean;
    isCritical: boolean;
  };
}

// Convert FullNPC to display info
export function toNPCDisplayInfo(npc: FullNPC): NPCDisplayInfo {
  return {
    id: npc.id,
    name: npc.name,
    nickname: npc.nickname,
    role: npc.role,
    attitude: npc.attitude,
    status: npc.status,
    isAlive: npc.isAlive,
    wounds: {
      hasBleeding: npc.wounds.bleeding > 0,
      hasBroken: npc.wounds.broken > 0,
      isCritical: npc.wounds.critical
    }
  };
}

// Default wounds structure for NPCs
export function createDefaultNPCWounds(): Wounds {
  return {
    bruised: 0,
    bleeding: 0,
    broken: 0,
    critical: false
  };
}

// Create empty NPC template
export function createEmptyNPC(id: string, name: string): FullNPC {
  return {
    id,
    name,
    role: 'Survivor',
    age: 'adult',
    appearance: '',
    attributes: { grit: 2, reflex: 2, wits: 2, nerve: 2 },
    skills: {},
    wounds: createDefaultNPCWounds(),
    stress: 0,
    maxStress: 6,
    weapons: [],
    armor: null,
    inventory: [],
    personality: {
      traits: [],
      fears: [],
      motivations: [],
      quirks: []
    },
    attitude: {
      level: 'neutral',
      score: 0,
      reasons: []
    },
    secrets: [],
    backstory: '',
    currentGoals: [],
    isAlive: true,
    status: 'healthy',
    firstMet: {
      day: 1,
      location: 'Unknown',
      circumstances: 'Unknown'
    },
    significantEvents: [],
    isGenerated: true,
    generatedFrom: 'encounter'
  };
}

// Attitude score to level mapping
export function scoreToAttitudeLevel(score: number): AttitudeLevel {
  if (score <= -60) return 'hostile';
  if (score <= -20) return 'suspicious';
  if (score <= 20) return 'neutral';
  if (score <= 60) return 'friendly';
  return 'trusted';
}

// Get attitude color for UI
export function getAttitudeColor(level: AttitudeLevel): string {
  switch (level) {
    case 'hostile': return 'text-red-500';
    case 'suspicious': return 'text-orange-500';
    case 'neutral': return 'text-gray-400';
    case 'friendly': return 'text-green-500';
    case 'trusted': return 'text-blue-500';
  }
}

export function getAttitudeBgColor(level: AttitudeLevel): string {
  switch (level) {
    case 'hostile': return 'bg-red-500/20';
    case 'suspicious': return 'bg-orange-500/20';
    case 'neutral': return 'bg-gray-500/20';
    case 'friendly': return 'bg-green-500/20';
    case 'trusted': return 'bg-blue-500/20';
  }
}
