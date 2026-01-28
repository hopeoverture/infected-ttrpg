// Scenario Generation Prompts
// AI prompts for generating personalized scenarios based on character and preferences

import { Character, GamePreferences } from '../types';

export const SCENARIO_GENERATION_SYSTEM_PROMPT = `You are a creative scenario writer for INFECTED, a solo survival horror TTRPG set in a zombie apocalypse.

Your task is to generate 3 unique, personalized scenario options based on the player's character and their game preferences.

## RULES FOR SCENARIO GENERATION

### Character Integration
- Each scenario MUST tie directly to the character's:
  - Background and skills (give them situations where their expertise matters)
  - Personality traits (create moments that challenge or highlight these)
  - Greatest fear (include elements that may trigger this)
  - Lost loved one (if specified, weave their fate into the story)
  - Motivation (the scenario should give them a path toward this)
  - NPC bonds (trusted/wary NPCs should appear)

### Scenario Variety
Generate 3 DISTINCT scenarios that offer different:
1. Starting situations (urban vs rural, alone vs group, day vs night)
2. Immediate goals (escape, rescue, scavenge, defend)
3. Tonal approaches (action-heavy, mystery-focused, survival-focused)

### Location Design
- Starting locations should be evocative and specific
- Include 2-3 immediate dangers
- Include 2-3 potential resources
- Match the timeframe (day one = more intact, late = more ruined)

### NPC Design
- Each scenario should introduce 1-2 NPCs
- NPCs should have clear roles and first impressions
- If the player specified trusted/wary NPCs, include them

### Story Hooks
- Include 2-3 hooks that tie to the character's backstory
- Each hook should suggest a direction for the narrative

## OUTPUT FORMAT
Return a JSON object with this structure:
{
  "options": [
    {
      "id": "unique-id-1",
      "title": "Scenario Title",
      "tagline": "One-line hook (max 10 words)",
      "description": "2-3 paragraphs describing the setup",
      "themes": ["theme1", "theme2"],
      "startingLocation": {
        "name": "Location Name",
        "description": "Atmospheric description",
        "dangers": ["danger1", "danger2"],
        "resources": ["resource1", "resource2"]
      },
      "initialNPCs": [
        {
          "name": "NPC Name",
          "role": "Their role/background",
          "firstImpression": "What the player notices about them"
        }
      ],
      "hooks": ["hook1", "hook2"]
    }
  ]
}`;

export const SCENARIO_FINALIZATION_SYSTEM_PROMPT = `You are a narrative writer for INFECTED, a solo survival horror TTRPG.

The player has chosen a scenario option. Your task is to generate:
1. A full opening narrative (atmospheric, immersive, 3-5 paragraphs)
2. Complete NPC data with full stats, personality, and secrets
3. Story beats for the narrative arc
4. Potential plot twists
5. Win conditions

## NPC GENERATION RULES

### Attributes (10 points total, 1-4 each)
- GRIT: physical strength, toughness
- REFLEX: speed, agility, coordination
- WITS: perception, intelligence
- NERVE: willpower, composure

### Skills (8 points total, 0-3 each)
Choose 3-5 skills appropriate to their role:
- GRIT skills: brawl, endure, athletics
- REFLEX skills: shoot, stealth, drive
- WITS skills: medicine, craft, survival, search
- NERVE skills: persuade, deceive, intimidate

### Equipment
- Weapons: realistic for their background
- Armor: most survivors have none or light
- Inventory: 2-4 items relevant to their role

### Personality
- 2-3 traits that affect how they act
- 1-2 fears that create vulnerabilities
- 1-2 motivations driving them
- 1-2 quirks for roleplay flavor

### Attitude
- Level: hostile/suspicious/neutral/friendly/trusted
- Score: -100 to 100 (matches level thresholds)
- Reasons: 2-3 reasons for this attitude

### Secrets
- Each NPC should have at least 1 secret
- Secrets should be dramatically interesting

## STORY BEATS
Create 3-4 story beats (acts) that:
- Progress naturally from the opening
- Include moments that challenge the player
- Tie to the character's motivation
- Build toward a climactic moment

## OUTPUT FORMAT
Return a JSON object with this structure:
{
  "title": "Scenario Title",
  "tagline": "One-line hook",
  "openingNarrative": "3-5 paragraphs of immersive opening text...",
  "location": { /* same as option's startingLocation */ },
  "npcs": [
    {
      "id": "npc-1",
      "name": "Name",
      "nickname": null,
      "role": "Former paramedic",
      "age": "mid-30s",
      "appearance": "Physical description",
      "attributes": { "grit": 2, "reflex": 3, "wits": 3, "nerve": 2 },
      "skills": { "medicine": 3, "endure": 2, "search": 2, "persuade": 1 },
      "wounds": { "bruised": 0, "bleeding": 0, "broken": 0, "critical": false },
      "stress": 1,
      "maxStress": 6,
      "weapons": [
        { "name": "Scalpel", "type": "melee", "damage": 1, "range": "melee", "notes": "" }
      ],
      "armor": null,
      "inventory": [
        { "name": "First Aid Kit", "quantity": 1, "isSignificant": true }
      ],
      "personality": {
        "traits": ["calm under pressure", "protective"],
        "fears": ["losing another patient"],
        "motivations": ["find her sister"],
        "quirks": ["hums when treating wounds"]
      },
      "attitude": {
        "level": "neutral",
        "score": 10,
        "reasons": ["Just met", "Helped player once"]
      },
      "secrets": ["Her sister is already infected"],
      "backstory": "Brief backstory...",
      "currentGoals": ["Find medical supplies", "Locate her sister"],
      "isAlive": true,
      "status": "healthy",
      "firstMet": {
        "day": 1,
        "location": "Starting location",
        "circumstances": "How they met"
      },
      "significantEvents": [],
      "isGenerated": true,
      "generatedFrom": "scenario"
    }
  ],
  "storyBeats": [
    {
      "act": 1,
      "title": "The Awakening",
      "description": "What happens in this act",
      "possibleEvents": ["event1", "event2"],
      "playerMotivationTie": "How this connects to player's motivation",
      "tension": "medium"
    }
  ],
  "potentialTwists": ["twist1", "twist2"],
  "toneGuidance": "Guidelines for the GM's narrative tone...",
  "winConditions": ["condition1", "condition2"],
  "themes": ["theme1", "theme2"]
}`;

export function buildScenarioGenerationPrompt(
  character: Character,
  preferences: GamePreferences
): string {
  const personality = character.personality;
  const connections = character.connections;

  let characterContext = `## CHARACTER PROFILE

**Name**: ${character.name}${character.nickname ? ` "${character.nickname}"` : ''}
**Background**: ${character.background}
**Motivation**: ${character.motivation}

### Personality`;

  if (personality) {
    characterContext += `
- Primary Trait: ${personality.primaryTrait}${personality.secondaryTrait ? ` / Secondary: ${personality.secondaryTrait}` : ''}
- Greatest Fear: ${personality.greatestFear}
- Coping Mechanism: ${personality.copingMechanism}${personality.darkSecret ? `
- Dark Secret: ${personality.darkSecret}` : ''}`;
  }

  if (connections) {
    characterContext += `

### Connections`;
    if (connections.lostLovedOne) {
      characterContext += `
- Lost Loved One: ${connections.lostLovedOne.name} (${connections.lostLovedOne.relationship}) - ${connections.lostLovedOne.fate}`;
    }
    if (connections.whoTheyProtect) {
      characterContext += `
- Protecting: ${connections.whoTheyProtect}`;
    }
    if (connections.hauntingMemory) {
      characterContext += `
- Haunting Memory: ${connections.hauntingMemory}`;
    }
    if (connections.bonds && connections.bonds.length > 0) {
      characterContext += `
- NPC Bonds:`;
      connections.bonds.forEach(bond => {
        characterContext += `
  - ${bond.name} (${bond.type}): ${bond.description || 'No description'}`;
      });
    }
  }

  if (character.moralCode) {
    characterContext += `

### Moral Code: ${character.moralCode}`;
  }
  if (character.survivalPhilosophy) {
    characterContext += `
### Survival Philosophy: ${character.survivalPhilosophy}`;
  }

  const preferencesContext = `## GAME PREFERENCES

- **Difficulty**: ${preferences.difficulty}
- **Themes**: ${preferences.themes.join(', ')}
- **Play Style**: ${preferences.playStyle.roleplay}% Roleplay, ${preferences.playStyle.story}% Story, ${preferences.playStyle.combat}% Combat
- **Tone**: ${preferences.tone}`;

  return `${characterContext}

${preferencesContext}

Generate 3 unique scenario options tailored to this character and these preferences.`;
}

export function buildScenarioFinalizationPrompt(
  character: Character,
  preferences: GamePreferences,
  selectedOption: {
    id: string;
    title: string;
    tagline: string;
    description: string;
    themes: string[];
    startingLocation: {
      name: string;
      description: string;
      dangers: string[];
      resources: string[];
    };
    initialNPCs: Array<{ name: string; role: string; firstImpression: string }>;
    hooks: string[];
  }
): string {
  const personality = character.personality;
  const connections = character.connections;

  let characterContext = `## CHARACTER

**Name**: ${character.name}${character.nickname ? ` "${character.nickname}"` : ''}
**Background**: ${character.background}
**Motivation**: ${character.motivation}`;

  if (personality) {
    characterContext += `
**Personality**: ${personality.primaryTrait}${personality.secondaryTrait ? `, ${personality.secondaryTrait}` : ''}
**Fear**: ${personality.greatestFear}
**Coping**: ${personality.copingMechanism}`;
  }

  if (connections?.lostLovedOne) {
    characterContext += `
**Lost**: ${connections.lostLovedOne.name} (${connections.lostLovedOne.relationship}) - ${connections.lostLovedOne.fate}`;
  }

  const selectedContext = `## SELECTED SCENARIO

**Title**: ${selectedOption.title}
**Tagline**: ${selectedOption.tagline}

**Description**:
${selectedOption.description}

**Location**: ${selectedOption.startingLocation.name}
${selectedOption.startingLocation.description}
- Dangers: ${selectedOption.startingLocation.dangers.join(', ')}
- Resources: ${selectedOption.startingLocation.resources.join(', ')}

**Initial NPCs**:
${selectedOption.initialNPCs.map(npc => `- ${npc.name} (${npc.role}): ${npc.firstImpression}`).join('\n')}

**Story Hooks**:
${selectedOption.hooks.map(h => `- ${h}`).join('\n')}

**Themes**: ${selectedOption.themes.join(', ')}`;

  const preferencesContext = `## PREFERENCES
- Difficulty: ${preferences.difficulty}
- Tone: ${preferences.tone}
- Play Style: ${preferences.playStyle.roleplay}% RP, ${preferences.playStyle.story}% Story, ${preferences.playStyle.combat}% Combat`;

  return `${characterContext}

${selectedContext}

${preferencesContext}

Generate the full scenario with:
1. An immersive opening narrative (3-5 paragraphs, present tense, atmospheric)
2. Complete NPC stats for each initial NPC
3. Story beats that tie to the character's motivation
4. Potential twists and win conditions

The opening narrative should:
- Set the scene vividly
- Introduce the immediate situation
- Give the player a clear first choice to make
- End with "What do you do?"`;
}
