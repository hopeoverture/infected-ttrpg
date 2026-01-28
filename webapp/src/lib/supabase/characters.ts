// Character database operations

import { createClient } from './client';
import {
  CharacterTemplate,
  CharacterSummary,
  Background,
  Attributes,
  Skills,
  CharacterAppearance,
  ArtStyle,
  CharacterPersonality,
  CharacterConnections,
  MoralCode,
  SurvivalPhilosophy,
  CharacterScar
} from '../types';

// ============================================
// Type Converters
// ============================================

interface CharacterRow {
  id: string;
  user_id: string;
  name: string;
  nickname: string | null;
  background: string;
  appearance: unknown;
  portrait_url: string | null;
  art_style: string | null;
  attributes: unknown;
  skills: unknown;
  personality: unknown;
  connections: unknown;
  motivation: string;
  moral_code: string | null;
  survival_philosophy: string | null;
  voice_id: string | null;
  skill_points_available: number;
  attribute_points_available: number;
  scars: unknown;
  sessions_survived: number;
  times_used: number;
  created_at: string;
  updated_at: string;
}

export function dbRowToCharacterTemplate(row: CharacterRow): CharacterTemplate {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    nickname: row.nickname ?? undefined,
    background: row.background as Background,
    appearance: row.appearance as CharacterAppearance | undefined,
    portraitUrl: row.portrait_url ?? undefined,
    artStyle: row.art_style as ArtStyle | undefined,
    attributes: row.attributes as Attributes,
    skills: row.skills as Skills,
    personality: row.personality as CharacterPersonality | undefined,
    connections: row.connections as CharacterConnections | undefined,
    motivation: row.motivation,
    moralCode: row.moral_code as MoralCode | undefined,
    survivalPhilosophy: row.survival_philosophy as SurvivalPhilosophy | undefined,
    voiceId: row.voice_id ?? undefined,
    skillPointsAvailable: row.skill_points_available,
    attributePointsAvailable: row.attribute_points_available,
    scars: (row.scars as CharacterScar[]) || [],
    sessionsSurvived: row.sessions_survived,
    timesUsed: row.times_used,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  };
}

export function dbRowToCharacterSummary(row: CharacterRow): CharacterSummary {
  return {
    id: row.id,
    name: row.name,
    nickname: row.nickname ?? undefined,
    background: row.background as Background,
    portraitUrl: row.portrait_url ?? undefined,
    timesUsed: row.times_used,
    sessionsSurvived: row.sessions_survived,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  };
}

// ============================================
// Read Operations
// ============================================

export async function getCharacters(): Promise<CharacterSummary[]> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('characters')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }

  return (data || []).map((row: CharacterRow) => dbRowToCharacterSummary(row));
}

export async function getCharacter(characterId: string): Promise<CharacterTemplate | null> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching character:', error);
    throw error;
  }

  return dbRowToCharacterTemplate(data as CharacterRow);
}

// ============================================
// Create Operations
// ============================================

export interface CreateCharacterParams {
  name: string;
  nickname?: string;
  background: Background;
  attributes: Attributes;
  skills: Skills;
  motivation: string;
  portraitUrl?: string;
  appearance?: CharacterAppearance;
  artStyle?: ArtStyle;
  personality?: CharacterPersonality;
  connections?: CharacterConnections;
  moralCode?: MoralCode;
  survivalPhilosophy?: SurvivalPhilosophy;
  voiceId?: string;
}

export async function createCharacter(params: CreateCharacterParams): Promise<string> {
  const supabase = createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Must be logged in to create a character');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('characters')
    .insert({
      user_id: user.id,
      name: params.name,
      nickname: params.nickname || null,
      background: params.background,
      attributes: params.attributes,
      skills: params.skills,
      motivation: params.motivation,
      portrait_url: params.portraitUrl || null,
      appearance: params.appearance || {},
      art_style: params.artStyle || 'cinematic',
      personality: params.personality || {},
      connections: params.connections || {},
      moral_code: params.moralCode || null,
      survival_philosophy: params.survivalPhilosophy || null,
      voice_id: params.voiceId || null
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating character:', error);
    throw error;
  }

  return data.id;
}

// ============================================
// Update Operations
// ============================================

export interface UpdateCharacterParams {
  name?: string;
  nickname?: string;
  portraitUrl?: string;
  appearance?: CharacterAppearance;
  artStyle?: ArtStyle;
  personality?: CharacterPersonality;
  connections?: CharacterConnections;
  moralCode?: MoralCode;
  survivalPhilosophy?: SurvivalPhilosophy;
  motivation?: string;
  voiceId?: string;
  // Progression updates (from gameplay)
  skillPointsAvailable?: number;
  attributePointsAvailable?: number;
  scars?: CharacterScar[];
  sessionsSurvived?: number;
  // Stat updates (when spending points)
  attributes?: Attributes;
  skills?: Skills;
}

export async function updateCharacter(
  characterId: string,
  updates: UpdateCharacterParams
): Promise<void> {
  const supabase = createClient();

  const dbUpdates: Record<string, unknown> = {};

  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.nickname !== undefined) dbUpdates.nickname = updates.nickname;
  if (updates.portraitUrl !== undefined) dbUpdates.portrait_url = updates.portraitUrl;
  if (updates.appearance !== undefined) dbUpdates.appearance = updates.appearance;
  if (updates.artStyle !== undefined) dbUpdates.art_style = updates.artStyle;
  if (updates.personality !== undefined) dbUpdates.personality = updates.personality;
  if (updates.connections !== undefined) dbUpdates.connections = updates.connections;
  if (updates.moralCode !== undefined) dbUpdates.moral_code = updates.moralCode;
  if (updates.survivalPhilosophy !== undefined) dbUpdates.survival_philosophy = updates.survivalPhilosophy;
  if (updates.motivation !== undefined) dbUpdates.motivation = updates.motivation;
  if (updates.voiceId !== undefined) dbUpdates.voice_id = updates.voiceId;
  if (updates.skillPointsAvailable !== undefined) dbUpdates.skill_points_available = updates.skillPointsAvailable;
  if (updates.attributePointsAvailable !== undefined) dbUpdates.attribute_points_available = updates.attributePointsAvailable;
  if (updates.scars !== undefined) dbUpdates.scars = updates.scars;
  if (updates.sessionsSurvived !== undefined) dbUpdates.sessions_survived = updates.sessionsSurvived;
  if (updates.attributes !== undefined) dbUpdates.attributes = updates.attributes;
  if (updates.skills !== undefined) dbUpdates.skills = updates.skills;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('characters')
    .update(dbUpdates)
    .eq('id', characterId);

  if (error) {
    console.error('Error updating character:', error);
    throw error;
  }
}

// ============================================
// Delete Operations
// ============================================

export async function deleteCharacter(characterId: string): Promise<void> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('characters')
    .delete()
    .eq('id', characterId);

  if (error) {
    console.error('Error deleting character:', error);
    throw error;
  }
}

// ============================================
// Usage Tracking
// ============================================

export async function incrementTimesUsed(characterId: string): Promise<void> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: current, error: fetchError } = await (supabase as any)
    .from('characters')
    .select('times_used')
    .eq('id', characterId)
    .single();

  if (fetchError) {
    console.error('Error fetching character for increment:', fetchError);
    throw fetchError;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase as any)
    .from('characters')
    .update({ times_used: (current.times_used || 0) + 1 })
    .eq('id', characterId);

  if (updateError) {
    console.error('Error incrementing times_used:', updateError);
    throw updateError;
  }
}

// Award a skill point after surviving a session
export async function awardSkillPoint(characterId: string): Promise<void> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: current, error: fetchError } = await (supabase as any)
    .from('characters')
    .select('skill_points_available, sessions_survived')
    .eq('id', characterId)
    .single();

  if (fetchError) {
    console.error('Error fetching character for skill point:', fetchError);
    throw fetchError;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase as any)
    .from('characters')
    .update({
      skill_points_available: (current.skill_points_available || 0) + 1,
      sessions_survived: (current.sessions_survived || 0) + 1
    })
    .eq('id', characterId);

  if (updateError) {
    console.error('Error awarding skill point:', updateError);
    throw updateError;
  }
}

// Award an attribute point after surviving a major threat
export async function awardAttributePoint(characterId: string): Promise<void> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: current, error: fetchError } = await (supabase as any)
    .from('characters')
    .select('attribute_points_available')
    .eq('id', characterId)
    .single();

  if (fetchError) {
    console.error('Error fetching character for attribute point:', fetchError);
    throw fetchError;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase as any)
    .from('characters')
    .update({
      attribute_points_available: (current.attribute_points_available || 0) + 1
    })
    .eq('id', characterId);

  if (updateError) {
    console.error('Error awarding attribute point:', updateError);
    throw updateError;
  }
}

// Add a scar from surviving a critical wound
export async function addScar(characterId: string, scar: CharacterScar): Promise<void> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: current, error: fetchError } = await (supabase as any)
    .from('characters')
    .select('scars')
    .eq('id', characterId)
    .single();

  if (fetchError) {
    console.error('Error fetching character for scar:', fetchError);
    throw fetchError;
  }

  const existingScars = (current.scars as CharacterScar[]) || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase as any)
    .from('characters')
    .update({
      scars: [...existingScars, scar]
    })
    .eq('id', characterId);

  if (updateError) {
    console.error('Error adding scar:', updateError);
    throw updateError;
  }
}
