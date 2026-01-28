// Game database operations

import { createClient } from './client';
import { GameRow, GameSummaryRow, MessageRow } from './types';
import { 
  GameState, 
  GameSummary, 
  Character, 
  Message,
  Background,
  Attributes,
  Skills,
  BACKGROUNDS
} from '../types';
import { getScenario } from '../scenarios';

// ============================================
// Type Converters
// ============================================

export function dbRowToGameSummary(row: GameSummaryRow): GameSummary {
  return {
    id: row.id,
    title: row.title,
    characterName: row.character_name,
    background: row.background as Background,
    day: row.day,
    threat: row.threat,
    updatedAt: new Date(row.updated_at),
    isGameOver: row.is_game_over,
    deathDay: row.death_day ?? undefined
  };
}

export function dbRowToGameState(row: GameRow, messages: MessageRow[]): GameState {
  const character = row.character as unknown as Character;
  const location = row.location as unknown as GameState['location'];
  const party = (row.party as unknown as GameState['party']) || [];
  const objectives = (row.objectives as unknown as GameState['objectives']) || [];
  const combatState = row.combat_state as unknown as GameState['combatState'];
  // Handle scenario_id - may not exist in older records
  const scenarioId = (row as Record<string, unknown>).scenario_id as string | undefined;

  return {
    id: row.id,
    title: row.title,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    character,
    day: row.day,
    time: row.time_of_day,
    location,
    threat: row.threat,
    threatState: row.threat_state,
    party,
    objectives,
    scenarioId,
    messages: messages.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: new Date(m.created_at),
      roll: m.roll_data as unknown as Message['roll']
    })),
    combatState,
    sessionStartTime: row.session_start_time ? new Date(row.session_start_time) : new Date(),
    rollCount: row.roll_count,
    killCount: row.kill_count
  };
}

// ============================================
// Read Operations
// ============================================

export async function getGames(): Promise<GameSummary[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('game_summaries')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching games:', error);
    throw error;
  }

  return (data || []).map(dbRowToGameSummary);
}

export async function getGame(gameId: string): Promise<GameState | null> {
  const supabase = createClient();

  // Get game data
  const { data: gameData, error: gameError } = await supabase
    .from('games')
    .select('*')
    .eq('id', gameId)
    .single();

  if (gameError) {
    if (gameError.code === 'PGRST116') return null; // Not found
    console.error('Error fetching game:', gameError);
    throw gameError;
  }

  // Get messages
  const { data: messagesData, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .eq('game_id', gameId)
    .order('sequence_num', { ascending: true });

  if (messagesError) {
    console.error('Error fetching messages:', messagesError);
    throw messagesError;
  }

  return dbRowToGameState(gameData, messagesData || []);
}

// ============================================
// Create Operations
// ============================================

export interface CreateGameParams {
  name: string;
  background: Background;
  attributes: Attributes;
  skills: Skills;
  motivation: string;
  scenario: string; // Scenario ID or 'custom'
  customScenario?: string;
  portraitUrl?: string;
  appearance?: import('../types').CharacterAppearance;
  artStyle?: import('../types').ArtStyle;
}

export async function createGame(params: CreateGameParams): Promise<string> {
  const supabase = createClient();
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Must be logged in to create a game');
  }

  const backgroundData = BACKGROUNDS[params.background];
  
  // Apply background skill bonus
  const skills = { ...params.skills };
  skills[backgroundData.bonus] = Math.min(4, skills[backgroundData.bonus] + 1);

  // Calculate derived stats
  const maxStress = params.attributes.nerve + 3;
  const carryingCapacity = params.attributes.grit + 4;
  const bruisedBonus = Math.max(0, params.attributes.grit - 2);

  // Create character object
  const character: Character = {
    id: crypto.randomUUID(),
    name: params.name,
    background: params.background,
    motivation: params.motivation,
    portraitUrl: params.portraitUrl,
    appearance: params.appearance,
    artStyle: params.artStyle,
    attributes: params.attributes,
    skills,
    wounds: { bruised: 0, bleeding: 0, broken: 0, critical: false },
    woundCapacity: { bruised: 4 + bruisedBonus, bleeding: 3, broken: 2, critical: 1 },
    stress: 0,
    maxStress,
    guts: 3,
    gutsEarnedThisSession: 0,
    inventory: backgroundData.gear.map((name, i) => ({
      id: `item-${i}`,
      name,
      quantity: 1,
      isSignificant: true
    })),
    weapons: [], // Will be populated based on background gear
    armor: null,
    carryingCapacity,
    food: 3,
    water: 3
  };

  // Parse weapons from gear
  const weaponGear = backgroundData.gear.filter(g => 
    g.toLowerCase().includes('pistol') || 
    g.toLowerCase().includes('rifle') ||
    g.toLowerCase().includes('knife') ||
    g.toLowerCase().includes('bow') ||
    g.toLowerCase().includes('bat')
  );
  
  // Simple weapon assignment (can be expanded)
  weaponGear.forEach((g, i) => {
    if (g.toLowerCase().includes('pistol')) {
      const suppressed = g.toLowerCase().includes('suppressed');
      character.weapons.push({
        id: `weapon-${i}`,
        name: suppressed ? 'Suppressed Pistol' : 'Pistol',
        damage: 3,
        range: 'Close/Med',
        noise: suppressed ? 2 : 5,
        properties: suppressed ? ['One-Handed', 'Quiet'] : ['One-Handed', 'Loud'],
        durability: suppressed ? 4 : 5,
        maxDurability: suppressed ? 4 : 5,
        ammo: parseInt(g.match(/\d+/)?.[0] || '12'),
        maxAmmo: 15
      });
    } else if (g.toLowerCase().includes('rifle')) {
      character.weapons.push({
        id: `weapon-${i}`,
        name: 'Rifle',
        damage: 4,
        range: 'Med/Far',
        noise: 6,
        properties: ['Two-Handed', 'Loud'],
        durability: 5,
        maxDurability: 5,
        ammo: parseInt(g.match(/\d+/)?.[0] || '10'),
        maxAmmo: 20
      });
    } else if (g.toLowerCase().includes('knife')) {
      character.weapons.push({
        id: `weapon-${i}`,
        name: g.includes('Combat') ? 'Combat Knife' : 'Knife',
        damage: 2,
        range: 'Melee',
        noise: 1,
        properties: ['Fast', 'Quiet'],
        durability: 4,
        maxDurability: 4
      });
    } else if (g.toLowerCase().includes('bow')) {
      character.weapons.push({
        id: `weapon-${i}`,
        name: 'Bow',
        damage: 3,
        range: 'Med/Far',
        noise: 1,
        properties: ['Two-Handed', 'Quiet', 'Slow'],
        durability: 4,
        maxDurability: 4,
        ammo: parseInt(g.match(/\d+/)?.[0] || '12'),
        maxAmmo: 20
      });
    } else if (g.toLowerCase().includes('bat')) {
      character.weapons.push({
        id: `weapon-${i}`,
        name: 'Baseball Bat',
        damage: 2,
        range: 'Melee',
        noise: 2,
        properties: ['Two-Handed', 'Brutal'],
        durability: 3,
        maxDurability: 3
      });
    }
  });

  // Check for armor
  if (backgroundData.gear.some(g => g.toLowerCase().includes('armor'))) {
    character.armor = {
      name: 'Light Armor',
      reduction: 2,
      stealthPenalty: 1,
      durability: 4,
      maxDurability: 4
    };
  }

  // Get scenario data
  const scenarioData = params.scenario !== 'custom' ? getScenario(params.scenario) : null;
  const isEarlyOutbreak = scenarioData?.timeframe === 'day-one' || scenarioData?.timeframe === 'early';
  
  // Starting location from scenario or defaults
  const location = scenarioData?.startingLocation 
    ? {
        name: scenarioData.startingLocation.name,
        description: scenarioData.startingLocation.description,
        lightLevel: 'bright' as const,
        scarcity: 'moderate' as const,
        ambientThreat: isEarlyOutbreak ? 2 : 4,
        searched: false
      }
    : {
        name: 'Unknown Location',
        description: params.customScenario || 'Your story begins here.',
        lightLevel: 'bright' as const,
        scarcity: 'moderate' as const,
        ambientThreat: 3,
        searched: false
      };

  // Create game title from scenario
  const title = scenarioData?.name || params.customScenario?.slice(0, 30) || 'New Story';

  // Insert game - use any to bypass strict typing issues with Supabase client
  // Calculate starting day and threat based on scenario timeframe
  const startingDay = scenarioData 
    ? { 'day-one': 1, 'early': 10, 'established': 35, 'late': 180 }[scenarioData.timeframe] || 1
    : 1;
  const startingThreat = scenarioData
    ? { 'day-one': 2, 'early': 4, 'established': 5, 'late': 6 }[scenarioData.timeframe] || 3
    : 3;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: gameData, error: gameError } = await (supabase as any)
    .from('games')
    .insert({
      user_id: user.id,
      title,
      character,
      day: startingDay,
      time_of_day: 'day',
      location,
      threat: startingThreat,
      threat_state: 'safe',
      session_start_time: new Date().toISOString(),
      // Store scenario data for GM reference (JSONB columns, pass objects directly)
      scenario_id: params.scenario || null,
      scenario_data: scenarioData ? {
        id: scenarioData.id,
        name: scenarioData.name,
        npcs: scenarioData.npcs,
        storyBeats: scenarioData.storyBeats,
        potentialTwists: scenarioData.potentialTwists,
        toneGuidance: scenarioData.toneGuidance
      } : null
    })
    .select('id')
    .single();

  if (gameError) {
    console.error('Error creating game:', {
      message: gameError.message,
      details: gameError.details,
      hint: gameError.hint,
      code: gameError.code,
      full: JSON.stringify(gameError, null, 2)
    });
    throw new Error(gameError.message || 'Failed to create game - check if database schema is up to date');
  }

  // Create initial GM message based on scenario
  let initialMessage: string;
  
  if (scenarioData) {
    // Generate message from scenario template
    const firstBeat = scenarioData.storyBeats[0];
    const firstNpc = scenarioData.npcs[0];
    
    // Build atmospheric intro based on scenario
    initialMessage = `**${scenarioData.name}**

*${scenarioData.tagline}*

---

${scenarioData.description}

You find yourself at **${scenarioData.startingLocation.name}** — ${scenarioData.startingLocation.description.toLowerCase()}

${character.name}, ${backgroundData.name}. Your motivation burns within you: *${params.motivation}*

${scenarioData.startingLocation.dangers.length > 0 
  ? `\n*Dangers nearby: ${scenarioData.startingLocation.dangers.slice(0, 2).join(', ')}*` 
  : ''}

${firstNpc ? `\nYou're not alone. Nearby, you notice **${firstNpc.name}** — ${firstNpc.role.toLowerCase()}. ${firstNpc.personality}` : ''}

${firstBeat ? `\n*${firstBeat.title}: ${firstBeat.description}*` : ''}

**What do you do?**`;
  } else if (params.customScenario) {
    // Custom scenario
    initialMessage = `**A New Story**

${params.customScenario}

---

${character.name}, ${backgroundData.name}.

In this world of the infected, you cling to one truth: *${params.motivation}*

Your story begins now.

**What do you do?**`;
  } else {
    // Fallback
    initialMessage = `**Day One**

You wake to screaming.

Not the usual city sounds — traffic, construction, the neighbor's dog. This is different. Raw. Desperate.

${character.name}, ${backgroundData.name}. Your motivation: *${params.motivation}*

The world you knew is ending.

**What do you do?**`;
  }

  // Add the initial message
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('messages')
    .insert({
      game_id: gameData.id,
      role: 'gm',
      content: initialMessage,
      sequence_num: 1
    });

  return gameData.id;
}

// ============================================
// Update Operations
// ============================================

export async function updateGame(gameId: string, updates: Partial<GameState>): Promise<void> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbUpdates: Record<string, any> = {};

  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.character !== undefined) dbUpdates.character = updates.character;
  if (updates.day !== undefined) dbUpdates.day = updates.day;
  if (updates.time !== undefined) dbUpdates.time_of_day = updates.time;
  if (updates.location !== undefined) dbUpdates.location = updates.location;
  if (updates.threat !== undefined) dbUpdates.threat = updates.threat;
  if (updates.threatState !== undefined) dbUpdates.threat_state = updates.threatState;
  if (updates.party !== undefined) dbUpdates.party = updates.party;
  if (updates.objectives !== undefined) dbUpdates.objectives = updates.objectives;
  if (updates.combatState !== undefined) dbUpdates.combat_state = updates.combatState;
  if (updates.rollCount !== undefined) dbUpdates.roll_count = updates.rollCount;
  if (updates.killCount !== undefined) dbUpdates.kill_count = updates.killCount;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('games')
    .update(dbUpdates)
    .eq('id', gameId);

  if (error) {
    console.error('Error updating game:', error);
    throw error;
  }
}

export async function addMessage(
  gameId: string,
  role: 'gm' | 'player' | 'system',
  content: string,
  rollData?: Message['roll']
): Promise<Message> {
  const supabase = createClient();

  // Use atomic INSERT with subquery to prevent race condition
  // This calculates sequence_num in the same transaction as the insert
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('insert_message_atomic', {
    p_game_id: gameId,
    p_role: role,
    p_content: content,
    p_roll_data: rollData || null
  });

  if (error) {
    // Fallback to non-atomic version if RPC doesn't exist (for backwards compatibility)
    if (error.code === 'PGRST202' || error.message?.includes('function') || error.message?.includes('does not exist')) {
      console.warn('insert_message_atomic RPC not found, using fallback');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: seqData, error: seqError } = await (supabase as any)
        .rpc('get_next_message_sequence', { p_game_id: gameId });

      if (seqError) {
        console.error('Error getting sequence:', seqError);
        throw seqError;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: insertData, error: insertError } = await (supabase as any)
        .from('messages')
        .insert({
          game_id: gameId,
          role,
          content,
          roll_data: rollData,
          sequence_num: seqData
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error adding message:', insertError);
        throw insertError;
      }

      return {
        id: insertData.id,
        role: insertData.role,
        content: insertData.content,
        timestamp: new Date(insertData.created_at),
        roll: insertData.roll_data as unknown as Message['roll']
      };
    }

    console.error('Error adding message:', error);
    throw error;
  }

  return {
    id: data.id,
    role: data.role,
    content: data.content,
    timestamp: new Date(data.created_at),
    roll: data.roll_data as unknown as Message['roll']
  };
}

// ============================================
// Delete Operations
// ============================================

export async function deleteGame(gameId: string): Promise<void> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('games')
    .delete()
    .eq('id', gameId);

  if (error) {
    console.error('Error deleting game:', error);
    throw error;
  }
}

// ============================================
// Game Over
// ============================================

export async function endGame(gameId: string, deathCause: string): Promise<void> {
  const supabase = createClient();

  // Get current day
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: gameData, error: fetchError } = await (supabase as any)
    .from('games')
    .select('day')
    .eq('id', gameId)
    .single();

  if (fetchError) throw fetchError;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('games')
    .update({
      is_game_over: true,
      death_day: gameData?.day,
      death_cause: deathCause
    })
    .eq('id', gameId);

  if (error) {
    console.error('Error ending game:', error);
    throw error;
  }
}
