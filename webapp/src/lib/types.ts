// INFECTED Web App - Core Types

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
  background: Background;
  motivation: string;
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
}

export interface Location {
  name: string;
  description: string;
  lightLevel: LightLevel;
  scarcity: Scarcity;
  ambientThreat: number;
  searched: boolean;
}

export interface NPC {
  id: string;
  name: string;
  relationship: 'hostile' | 'suspicious' | 'neutral' | 'friendly' | 'trusted';
  status: string;
  isAlive: boolean;
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
  
  // Party
  party: NPC[];
  
  // Story
  objectives: Objective[];
  
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
