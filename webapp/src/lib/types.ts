// INFECTED Web App - Core Types

// Import enhanced types
import type { FullNPC } from './types/full-npc';
import type { GamePreferences } from './types/game-preferences';
import type { FullGeneratedScenario } from './types/generated-scenario';

// Re-export for convenience
export type { FullNPC, NPCAttitude, NPCPersonality, NPCStatus, AttitudeLevel } from './types/full-npc';
export type { GamePreferences, Difficulty, Theme, Tone, PlayStyleFocus } from './types/game-preferences';
export type { ScenarioOption, FullGeneratedScenario, ScenarioLocation } from './types/generated-scenario';

// Character Appearance Options
export type AgeRange = 'young' | 'adult' | 'middle-aged' | 'older';
export type BodyType = 'slight' | 'average' | 'athletic' | 'heavy';
export type Gender = 'male' | 'female' | 'androgynous';

export interface CharacterAppearance {
  gender: Gender;
  age: AgeRange;
  bodyType: BodyType;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  facialHair?: string;
  distinguishingFeatures: string[];
  clothing?: string;
}

// Art Style Options
export type ArtStyle = 'realistic' | 'cinematic' | 'graphic-novel' | 'gritty' | 'painted';

export const ART_STYLE_PROMPTS: Record<ArtStyle, string> = {
  'realistic': 'photorealistic, detailed, natural lighting',
  'cinematic': 'cinematic lighting, movie still, dramatic atmosphere, film grain',
  'graphic-novel': 'graphic novel style, bold shadows, high contrast, comic book aesthetic',
  'gritty': 'gritty realism, harsh lighting, desaturated colors, raw documentary style',
  'painted': 'digital painting, painterly style, artistic brushstrokes, concept art'
};

export const DEFAULT_APPEARANCE: CharacterAppearance = {
  gender: 'male',
  age: 'adult',
  bodyType: 'average',
  skinTone: 'medium',
  hairStyle: 'short',
  hairColor: 'brown',
  distinguishingFeatures: []
};

// Personality Types
export type PersonalityTrait =
  | 'cautious' | 'reckless' | 'compassionate' | 'ruthless'
  | 'optimistic' | 'cynical' | 'leader' | 'loner'
  | 'protective' | 'self-serving';

export type Fear =
  | 'turning' | 'losing-others' | 'isolation' | 'darkness'
  | 'enclosed-spaces' | 'betrayal' | 'failure';

export type CopingMechanism =
  | 'humor' | 'isolation' | 'aggression' | 'denial'
  | 'planning' | 'faith' | 'work' | 'hope';

export type MoralCode =
  | 'protector' | 'survivor-first' | 'communal' | 'pragmatist';

export type SurvivalPhilosophy =
  | 'lone-wolf' | 'build-community' | 'keep-moving' | 'fortify' | 'day-by-day';

export interface CharacterPersonality {
  primaryTrait: PersonalityTrait;
  secondaryTrait?: PersonalityTrait;
  greatestFear: Fear;
  copingMechanism: CopingMechanism;
  darkSecret?: string;
}

export interface LostLovedOne {
  name: string;
  relationship: string;
  fate: 'dead' | 'turned' | 'missing';
}

export interface NPCBond {
  name: string;
  type: 'trust' | 'wary';
  description?: string;
}

export interface CharacterConnections {
  lostLovedOne?: LostLovedOne;
  hauntingMemory?: string;
  whoTheyProtect?: string;
  sentimentalItem?: string;
  bonds?: NPCBond[];
}

export interface CharacterScar {
  description: string;
  source: string;
  earnedDay?: number;
}

// Display labels for personality options
export const PERSONALITY_TRAITS: Record<PersonalityTrait, { name: string; description: string }> = {
  'cautious': { name: 'Cautious', description: 'You think before you act, always weighing the risks' },
  'reckless': { name: 'Reckless', description: 'You act first and deal with consequences later' },
  'compassionate': { name: 'Compassionate', description: 'You feel deeply for others and their suffering' },
  'ruthless': { name: 'Ruthless', description: 'You do what needs to be done, no matter the cost' },
  'optimistic': { name: 'Optimistic', description: 'You believe things will get better, somehow' },
  'cynical': { name: 'Cynical', description: 'You expect the worst and are rarely disappointed' },
  'leader': { name: 'Leader', description: 'You naturally take charge and make decisions' },
  'loner': { name: 'Loner', description: 'You work best alone and trust yourself most' },
  'protective': { name: 'Protective', description: 'You put others\' safety before your own' },
  'self-serving': { name: 'Self-Serving', description: 'Your survival comes first, always' }
};

export const FEARS: Record<Fear, { name: string; description: string }> = {
  'turning': { name: 'Turning', description: 'Becoming one of them terrifies you more than death' },
  'losing-others': { name: 'Losing Others', description: 'Watching people you care about die or turn' },
  'isolation': { name: 'Isolation', description: 'Being completely alone with no one left' },
  'darkness': { name: 'Darkness', description: 'What lurks in the shadows you cannot see' },
  'enclosed-spaces': { name: 'Enclosed Spaces', description: 'Being trapped with no way out' },
  'betrayal': { name: 'Betrayal', description: 'Being stabbed in the back by someone you trusted' },
  'failure': { name: 'Failure', description: 'Not being good enough when it matters most' }
};

export const COPING_MECHANISMS: Record<CopingMechanism, { name: string; description: string }> = {
  'humor': { name: 'Humor', description: 'You joke to keep the darkness at bay' },
  'isolation': { name: 'Isolation', description: 'You withdraw into yourself to process' },
  'aggression': { name: 'Aggression', description: 'You channel pain into action and violence' },
  'denial': { name: 'Denial', description: 'You pretend things are fine until they aren\'t' },
  'planning': { name: 'Planning', description: 'You obsess over preparation and contingencies' },
  'faith': { name: 'Faith', description: 'You hold onto belief in something greater' },
  'work': { name: 'Work', description: 'You stay busy to avoid thinking too much' },
  'hope': { name: 'Hope', description: 'You cling to the belief that tomorrow will be better' }
};

export const MORAL_CODES: Record<MoralCode, { name: string; description: string }> = {
  'protector': { name: 'Protector', description: 'Defend the innocent at any cost' },
  'survivor-first': { name: 'Survivor First', description: 'Your survival trumps all other concerns' },
  'communal': { name: 'Communal', description: 'The group\'s needs outweigh individual wants' },
  'pragmatist': { name: 'Pragmatist', description: 'Do what works, morality is a luxury' }
};

export const SURVIVAL_PHILOSOPHIES: Record<SurvivalPhilosophy, { name: string; description: string }> = {
  'lone-wolf': { name: 'Lone Wolf', description: 'Travel light, trust no one, keep moving' },
  'build-community': { name: 'Build Community', description: 'Safety in numbers, rebuild society' },
  'keep-moving': { name: 'Keep Moving', description: 'Never stay in one place too long' },
  'fortify': { name: 'Fortify', description: 'Find a defensible position and hold it' },
  'day-by-day': { name: 'Day by Day', description: 'Don\'t plan too far ahead, survive today' }
};

export type Background = 
  | 'survivor' | 'soldier' | 'medic' | 'mechanic' | 'scout' 
  | 'leader' | 'hunter' | 'criminal' | 'veterinarian' | 'professor' 
  | 'enforcer' | 'ranger';

export type SkillName = 
  // GRIT
  | 'brawl' | 'endure' | 'athletics'
  // REFLEX
  | 'shoot' | 'stealth' | 'drive'
  // WITS
  | 'notice' | 'craft' | 'tech' | 'medicine' | 'survival' | 'knowledge'
  // NERVE
  | 'persuade' | 'deceive' | 'resolve' | 'intimidate' | 'animals';

export type AttributeName = 'grit' | 'reflex' | 'wits' | 'nerve';

export type ThreatState = 'safe' | 'noticed' | 'investigating' | 'encounter' | 'swarm';

export type TimeOfDay = 'night' | 'dawn' | 'day' | 'dusk';

export type LightLevel = 'dark' | 'dim' | 'bright';

export type Scarcity = 'pristine' | 'untouched' | 'moderate' | 'sparse' | 'picked-clean';

export interface Attributes {
  grit: number;
  reflex: number;
  wits: number;
  nerve: number;
}

export interface Skills {
  brawl: number;
  endure: number;
  athletics: number;
  shoot: number;
  stealth: number;
  drive: number;
  notice: number;
  craft: number;
  tech: number;
  medicine: number;
  survival: number;
  knowledge: number;
  persuade: number;
  deceive: number;
  resolve: number;
  intimidate: number;
  animals: number;
}

export interface Wounds {
  bruised: number;      // Current wounds at this level
  bleeding: number;
  broken: number;
  critical: boolean;
}

export interface WoundCapacity {
  bruised: number;      // Max slots (4 + GRIT bonus)
  bleeding: number;     // Always 3
  broken: number;       // Always 2
  critical: number;     // Always 1
}

export interface Weapon {
  id: string;
  name: string;
  damage: number;
  range: string;
  noise: number;
  properties: string[];
  durability: number;
  maxDurability: number;
  ammo?: number;
  maxAmmo?: number;
}

export interface Armor {
  name: string;
  reduction: number;
  stealthPenalty: number;
  durability: number;
  maxDurability: number;
}

export interface Item {
  id: string;
  name: string;
  quantity: number;
  isSignificant: boolean;
  description?: string;
}

export interface Character {
  id: string;
  name: string;
  nickname?: string;
  background: Background;
  motivation: string;
  portraitUrl?: string;
  appearance?: CharacterAppearance;
  artStyle?: ArtStyle;
  attributes: Attributes;
  skills: Skills;
  wounds: Wounds;
  woundCapacity: WoundCapacity;
  stress: number;
  maxStress: number;
  guts: number;
  gutsEarnedThisSession: number;
  inventory: Item[];
  weapons: Weapon[];
  armor: Armor | null;
  carryingCapacity: number;
  food: number;
  water: number;
  // Personality & psychology
  personality?: CharacterPersonality;
  // Connections & relationships
  connections?: CharacterConnections;
  // Moral stance
  moralCode?: MoralCode;
  survivalPhilosophy?: SurvivalPhilosophy;
  // Progression (per DESIGN.md)
  scars?: CharacterScar[];
  // Voice settings for multi-voice audio
  voiceId?: string;
}

// Standalone character template (without game state like wounds/inventory)
export interface CharacterTemplate {
  id: string;
  userId: string;
  name: string;
  nickname?: string;
  background: Background;
  motivation: string;
  portraitUrl?: string;
  appearance?: CharacterAppearance;
  artStyle?: ArtStyle;
  attributes: Attributes;
  skills: Skills;
  personality?: CharacterPersonality;
  connections?: CharacterConnections;
  moralCode?: MoralCode;
  survivalPhilosophy?: SurvivalPhilosophy;
  // Voice settings for multi-voice audio
  voiceId?: string;
  // Progression
  skillPointsAvailable: number;
  attributePointsAvailable: number;
  scars: CharacterScar[];
  sessionsSurvived: number;
  // Metadata
  timesUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

// Summary for list views
export interface CharacterSummary {
  id: string;
  name: string;
  nickname?: string;
  background: Background;
  portraitUrl?: string;
  timesUsed: number;
  sessionsSurvived: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  name: string;
  description: string;
  lightLevel: LightLevel;
  scarcity: Scarcity;
  ambientThreat: number;
  searched: boolean;
  sceneImageUrl?: string;
}

// Legacy NPC interface for backwards compatibility
export interface NPC {
  id: string;
  name: string;
  relationship: 'hostile' | 'suspicious' | 'neutral' | 'friendly' | 'trusted';
  status: string;
  isAlive: boolean;
}

// Party member can be either legacy NPC or FullNPC
export type PartyMember = NPC | FullNPC;

// Type guard to check if party member is a FullNPC
export function isFullNPC(member: PartyMember): member is FullNPC {
  return 'attributes' in member && 'attitude' in member;
}

export interface Objective {
  id: string;
  text: string;
  completed: boolean;
}

export interface DieResult {
  value: number;
  isHit: boolean;
  isExplosion: boolean;
  isCriticalOne?: boolean;
}

export interface RollResult {
  dice: DieResult[];
  bonusDice: DieResult[];
  totalHits: number;
  isCriticalFailure: boolean;
  description: string;
}

export interface Message {
  id: string;
  role: 'gm' | 'player' | 'system';
  content: string;
  timestamp: Date;
  roll?: RollResult;
}

export interface Combatant {
  id: string;
  name: string;
  isPlayer: boolean;
  initiativeHits: number;
  wounds: Wounds;
  woundCapacity: WoundCapacity;
  actionUsed: boolean;
  moveUsed: boolean;
}

export interface CombatState {
  round: number;
  turnOrder: Combatant[];
  currentTurnIndex: number;
  isPlayerTurn: boolean;
}

export interface GameState {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;

  // Character
  character: Character;

  // World
  day: number;
  time: TimeOfDay;
  location: Location;
  threat: number;
  threatState: ThreatState;

  // Party - can contain both legacy NPC and FullNPC
  party: PartyMember[];

  // Story
  objectives: Objective[];
  scenarioId?: string; // Premade scenario ID for story guidance (legacy)

  // New: Generated scenario and preferences
  generatedScenario?: FullGeneratedScenario;
  preferences?: GamePreferences;

  // Session
  messages: Message[];
  combatState: CombatState | null;
  sessionStartTime: Date;
  rollCount: number;
  killCount: number;
}

export interface GameSummary {
  id: string;
  title: string;
  characterName: string;
  background: Background;
  day: number;
  threat: number;
  updatedAt: Date;
  isGameOver: boolean;
  deathDay?: number;
}

// Background data
export const BACKGROUNDS: Record<Background, {
  name: string;
  bonus: SkillName;
  gear: string[];
  description: string;
}> = {
  survivor: {
    name: 'Survivor',
    bonus: 'endure',
    gear: ['Backpack', 'Knife', '3 days food', 'Lighter', 'Crowbar'],
    description: 'You\'ve made it this far on instinct and grit.'
  },
  soldier: {
    name: 'Soldier',
    bonus: 'shoot',
    gear: ['Pistol (12 rounds)', 'Light armor', 'Combat knife', 'Radio'],
    description: 'You were trained for war. This isn\'t what you trained for.'
  },
  medic: {
    name: 'Medic',
    bonus: 'medicine',
    gear: ['First aid kit (5 uses)', 'Antibiotics (2)', 'Flashlight', 'Surgical tools'],
    description: 'You took an oath to do no harm. Now harm is everywhere.'
  },
  mechanic: {
    name: 'Mechanic',
    bonus: 'craft',
    gear: ['Tool kit', 'Duct tape', 'Parts (5)', 'Crowbar', 'Work gloves'],
    description: 'If it\'s broken, you can fix it. Most things are broken now.'
  },
  scout: {
    name: 'Scout',
    bonus: 'stealth',
    gear: ['Binoculars', 'Rope (50ft)', 'Suppressed pistol (8 rounds)', 'Map'],
    description: 'You move unseen. In this world, that\'s how you stay alive.'
  },
  leader: {
    name: 'Leader',
    bonus: 'persuade',
    gear: ['Radio', 'Map', 'Flare gun (3 flares)', 'Notebook'],
    description: 'People look to you for answers. You hope you have them.'
  },
  hunter: {
    name: 'Hunter',
    bonus: 'survival',
    gear: ['Bow (12 arrows)', 'Hunting knife', '3 days food', 'Camo clothing'],
    description: 'The wilderness was your home. Now it\'s everyone\'s.'
  },
  criminal: {
    name: 'Criminal',
    bonus: 'deceive',
    gear: ['Lockpicks', 'Pistol (6 rounds)', '2 days food', 'Fake ID'],
    description: 'You lived outside the law. Now there is no law.'
  },
  veterinarian: {
    name: 'Veterinarian',
    bonus: 'animals',
    gear: ['Medical kit (animal)', 'Leash/muzzle', '2 days food', 'Sedatives (3)'],
    description: 'You healed creatures who couldn\'t speak. Now everyone screams.'
  },
  professor: {
    name: 'Professor',
    bonus: 'knowledge',
    gear: ['Notebook', 'Reference books', 'Flashlight', 'Reading glasses', 'Pen'],
    description: 'You studied history. Now you\'re living through it.'
  },
  enforcer: {
    name: 'Enforcer',
    bonus: 'intimidate',
    gear: ['Baseball bat', 'Leather jacket', 'Brass knuckles', 'Cigarettes', 'Switchblade'],
    description: 'You made people afraid. Fear is useful now.'
  },
  ranger: {
    name: 'Ranger',
    bonus: 'survival',
    gear: ['Rifle (10 rounds)', 'Compass', 'Water filter', '3 days food', 'Fire starter'],
    description: 'You protected the wild places. Now you protect yourself.'
  }
};

// Skill to Attribute mapping
export const SKILL_ATTRIBUTES: Record<SkillName, AttributeName> = {
  brawl: 'grit',
  endure: 'grit',
  athletics: 'grit', // Note: also uses REFLEX for throwing/dodging
  shoot: 'reflex',
  stealth: 'reflex',
  drive: 'reflex',
  notice: 'wits',
  craft: 'wits',
  tech: 'wits',
  medicine: 'wits', // Note: Surgery uses NERVE
  survival: 'wits',
  knowledge: 'wits',
  persuade: 'nerve',
  deceive: 'nerve',
  resolve: 'nerve',
  intimidate: 'nerve',
  animals: 'nerve'
};

// Default skills (all 0)
export const DEFAULT_SKILLS: Skills = {
  brawl: 0,
  endure: 0,
  athletics: 0,
  shoot: 0,
  stealth: 0,
  drive: 0,
  notice: 0,
  craft: 0,
  tech: 0,
  medicine: 0,
  survival: 0,
  knowledge: 0,
  persuade: 0,
  deceive: 0,
  resolve: 0,
  intimidate: 0,
  animals: 0
};

// GM API State Changes - shared between API route and hooks
// NPC update in state changes
export interface NPCStateChange {
  id: string;
  name: string;
  // For new NPCs joining the party - include full data
  fullData?: FullNPC;
  // For updating existing NPCs
  updates?: {
    attitude?: { level: string; change: number; reason: string };
    wounds?: { type: 'bruised' | 'bleeding' | 'broken' | 'critical'; change: number };
    status?: string;
    inventory?: { add?: string[]; remove?: string[] };
    secrets?: { reveal: string[] };
    goals?: { add?: string[]; remove?: string[] };
  };
  // Legacy fields for backwards compatibility
  status?: string;
  relationship?: string;
  // NPC actions
  action?: 'join' | 'leave' | 'die' | 'turn';
}

export interface GMStateChanges {
  threat?: number | null;
  threatState?: ThreatState | null;
  stress?: number | null;
  wounds?: { type: 'bruised' | 'bleeding' | 'broken' | 'critical'; change: number } | null;
  guts?: number | null;
  gutsEarned?: number | null;
  kills?: number | null;  // Number of infected killed this action
  location?: {
    name: string;
    description: string;
    lightLevel: LightLevel;
    scarcity: Scarcity;
    ambientThreat: number;
  } | null;
  time?: TimeOfDay | null;
  day?: number | null;
  inventory?: { add?: string[]; remove?: string[] } | null;
  objectives?: { add?: string[]; complete?: string[] } | null;
  party?: NPCStateChange[] | null;
}
