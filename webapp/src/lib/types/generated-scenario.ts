// Generated Scenario Types
// Types for AI-generated personalized scenarios

import { FullNPC } from './full-npc';

// NPC summary for scenario options (before full generation)
export interface ScenarioNPCSummary {
  name: string;
  role: string;
  firstImpression: string;  // What player notices initially
}

// Starting location for a scenario
export interface ScenarioLocation {
  name: string;
  description: string;
  dangers: string[];
  resources: string[];
}

// One of the 3 scenario options presented to the player
export interface ScenarioOption {
  id: string;
  title: string;
  tagline: string;
  description: string;  // 2-3 paragraphs
  themes: string[];
  startingLocation: ScenarioLocation;
  initialNPCs: ScenarioNPCSummary[];
  hooks: string[];  // Story hooks that tie to character backstory/motivation
}

// Story beat for the generated scenario
export interface GeneratedStoryBeat {
  act: number;
  title: string;
  description: string;
  possibleEvents: string[];
  playerMotivationTie: string;  // How this connects to player's motivation
  tension: 'low' | 'medium' | 'high' | 'extreme';
}

// Full generated scenario after player selects an option
export interface FullGeneratedScenario {
  title: string;
  tagline: string;
  openingNarrative: string;  // The full intro story text
  location: ScenarioLocation;
  npcs: FullNPC[];
  storyBeats: GeneratedStoryBeat[];
  potentialTwists: string[];
  toneGuidance: string;
  winConditions: string[];
  themes: string[];
}

// Response from scenario generation API
export interface ScenarioGenerationResponse {
  options: ScenarioOption[];
  generationId: string;
}

// Response from scenario finalization API
export interface ScenarioFinalizationResponse {
  scenario: FullGeneratedScenario;
}

// State for tracking scenario generation in UI
export interface ScenarioGenerationState {
  isGenerating: boolean;
  options: ScenarioOption[] | null;
  generationId: string | null;
  selectedIndex: number | null;
  finalizedScenario: FullGeneratedScenario | null;
  isFinalizing: boolean;
  error: string | null;
}

export const INITIAL_SCENARIO_STATE: ScenarioGenerationState = {
  isGenerating: false,
  options: null,
  generationId: null,
  selectedIndex: null,
  finalizedScenario: null,
  isFinalizing: false,
  error: null
};
