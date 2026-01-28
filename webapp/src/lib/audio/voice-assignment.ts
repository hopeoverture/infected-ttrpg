/**
 * Voice Assignment
 * Automatically assigns voices to NPCs based on their attributes
 */

import { FullNPC } from '@/lib/types/full-npc';
import { NPC } from '@/lib/types';
import {
  NPCVoiceArchetype,
  VOICE_ARCHETYPE_POOLS,
  VOICE_OPTIONS,
  getVoiceById
} from '@/lib/types/voice';

/**
 * Determine the voice archetype for an NPC based on their attributes
 */
/**
 * Try to infer gender from appearance description or role
 */
function inferGenderFromDescription(description: string, role: string): boolean | null {
  const combinedText = `${description} ${role}`.toLowerCase();

  // Female indicators
  if (combinedText.match(/\b(woman|female|she|her|girl|lady|mother|sister|daughter|wife)\b/)) {
    return true; // is female
  }

  // Male indicators
  if (combinedText.match(/\b(man|male|he|him|boy|guy|father|brother|son|husband)\b/)) {
    return false; // is male
  }

  return null; // unknown
}

function determineArchetype(npc: FullNPC | NPC): NPCVoiceArchetype {
  // Check if it's a FullNPC with detailed attributes
  const isFullNPC = 'role' in npc && 'personality' in npc;

  if (isFullNPC) {
    const fullNpc = npc as FullNPC;
    const role = fullNpc.role?.toLowerCase() || '';
    const traits = fullNpc.personality?.traits || [];
    // In FullNPC, age is a top-level string property like "mid-30s", "elderly"
    const age = fullNpc.age || 'adult';

    // Try to determine gender from appearance description
    const inferredFemale = inferGenderFromDescription(fullNpc.appearance || '', role);
    const isFemale = inferredFemale === true;

    // Check role-based archetypes
    if (role.includes('doctor') || role.includes('medic') || role.includes('nurse')) {
      return isFemale ? 'authority-female' : 'authority-male';
    }

    if (role.includes('soldier') || role.includes('military') || role.includes('guard')) {
      return isFemale ? 'veteran-female' : 'veteran-male';
    }

    if (role.includes('leader') || role.includes('chief') || role.includes('boss')) {
      return isFemale ? 'authority-female' : 'authority-male';
    }

    if (role.includes('scientist') || role.includes('researcher') || role.includes('professor')) {
      return isFemale ? 'authority-female' : 'authority-male';
    }

    // Check trait-based archetypes
    const hasAggressiveTraits = traits.some(t =>
      ['aggressive', 'violent', 'ruthless', 'fierce', 'tough'].includes(t.toLowerCase())
    );

    const hasWarmTraits = traits.some(t =>
      ['kind', 'gentle', 'warm', 'caring', 'compassionate'].includes(t.toLowerCase())
    );

    const hasScaryTraits = traits.some(t =>
      ['creepy', 'unsettling', 'mysterious', 'sinister', 'eerie'].includes(t.toLowerCase())
    );

    if (hasAggressiveTraits) {
      return isFemale ? 'veteran-female' : 'veteran-male';
    }

    if (hasWarmTraits) {
      return isFemale ? 'young-female' : 'young-male';
    }

    if (hasScaryTraits) {
      return isFemale ? 'mysterious-female' : 'mysterious-male';
    }

    // Check age-based archetypes (age can be like "mid-30s", "elderly", "young adult")
    const ageLower = age.toLowerCase();
    if (ageLower.includes('young') || ageLower.includes('teen') || ageLower.includes('child')) {
      return isFemale ? 'young-female' : 'young-male';
    }

    if (ageLower.includes('elder') || ageLower.includes('older') || ageLower.includes('senior') || ageLower.includes('60') || ageLower.includes('70')) {
      return isFemale ? 'veteran-female' : 'veteran-male';
    }

    // Default by gender - use young for friendly default
    return isFemale ? 'young-female' : 'young-male';
  }

  // For basic NPC type, use relationship to infer
  const basicNpc = npc as NPC;

  // Try to infer gender from name or relationship
  const relationship = basicNpc.relationship?.toLowerCase() || '';

  if (relationship.includes('wife') || relationship.includes('mother') ||
      relationship.includes('sister') || relationship.includes('daughter')) {
    return 'young-female';
  }

  if (relationship.includes('husband') || relationship.includes('father') ||
      relationship.includes('brother') || relationship.includes('son')) {
    return 'young-male';
  }

  // Default to male young voice
  return 'young-male';
}

/**
 * Get a random voice ID from an archetype pool
 * Uses a seeded approach based on NPC ID for consistency
 */
function getVoiceFromPool(archetype: NPCVoiceArchetype, npcId: string): string {
  const pool = VOICE_ARCHETYPE_POOLS[archetype];

  if (!pool || pool.length === 0) {
    // Fallback to a default voice
    return 'adam';
  }

  // Simple hash of NPC ID for consistent selection
  let hash = 0;
  for (let i = 0; i < npcId.length; i++) {
    hash = ((hash << 5) - hash) + npcId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  const index = Math.abs(hash) % pool.length;
  return pool[index] || pool[0] || 'adam';
}

/**
 * Assign a voice to an NPC if they don't have one
 */
export function assignVoiceToNPC(npc: FullNPC | NPC): string {
  // If NPC already has a voice, use it
  if ('voiceId' in npc && npc.voiceId) {
    return npc.voiceId;
  }

  const archetype = determineArchetype(npc);
  return getVoiceFromPool(archetype, npc.id);
}

/**
 * Get voice ID for an NPC, with caching
 */
const voiceCache = new Map<string, string>();

export function getVoiceForNPC(npc: FullNPC | NPC): string {
  // Check cache first
  if (voiceCache.has(npc.id)) {
    return voiceCache.get(npc.id)!;
  }

  const voiceId = assignVoiceToNPC(npc);
  voiceCache.set(npc.id, voiceId);
  return voiceId;
}

/**
 * Clear the voice cache (e.g., when starting a new game)
 */
export function clearVoiceCache(): void {
  voiceCache.clear();
}

/**
 * Build a map of NPC names to their voice IDs
 */
export function buildNPCVoiceMap(npcs: (FullNPC | NPC)[]): Map<string, string> {
  const map = new Map<string, string>();

  for (const npc of npcs) {
    const voiceId = getVoiceForNPC(npc);
    map.set(npc.id, voiceId);

    // Also map by name for dialog parsing
    map.set(npc.name.toLowerCase(), voiceId);

    // Map by nickname if available
    if ('nickname' in npc && npc.nickname) {
      map.set(npc.nickname.toLowerCase(), voiceId);
    }
  }

  return map;
}

/**
 * Get the appropriate default voice for a character based on gender
 */
export function getDefaultCharacterVoice(gender?: 'male' | 'female' | 'androgynous'): string {
  if (gender === 'female') {
    // Return a default female voice
    return 'rachel';
  }

  if (gender === 'male') {
    // Return a default male voice
    return 'liam';
  }

  // Androgynous or unknown - use a neutral-sounding voice
  return 'rachel';
}

/**
 * Validate that a voice ID is valid
 */
export function isValidVoiceId(voiceId: string): boolean {
  return VOICE_OPTIONS.some(v => v.id === voiceId);
}

/**
 * Get voice display info for debugging/UI
 */
export function getVoiceInfo(voiceId: string): { name: string; description: string } | null {
  const voice = getVoiceById(voiceId);
  if (!voice) return null;

  return {
    name: voice.name,
    description: voice.description
  };
}
