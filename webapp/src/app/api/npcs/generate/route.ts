import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GameState } from '@/lib/types';
import { FullNPC } from '@/lib/types/full-npc';
import {
  checkRateLimit,
  RATE_LIMITS,
  createRateLimitResponse,
  createRateLimitHeaders
} from '@/lib/rate-limit';

interface NPCSummary {
  name: string;
  role: string;
  personality?: string;
  context: string; // How they're joining the party
}

interface GenerateNPCRequest {
  npcSummary: NPCSummary;
  gameState: GameState;
}

interface GenerateNPCResponse {
  npc: FullNPC;
}

const NPC_GENERATION_SYSTEM_PROMPT = `You are a character generator for INFECTED, a survival horror TTRPG.

Generate a complete NPC with full stats, equipment, personality, and backstory.

## ATTRIBUTE RULES (10 points total, 1-4 each)
- GRIT: physical strength, toughness, melee combat
- REFLEX: speed, agility, ranged combat, driving
- WITS: perception, intelligence, technical skills
- NERVE: willpower, social skills, composure

## SKILL RULES (8 points total, 0-3 each)
Choose 3-5 skills appropriate to their role:
- GRIT: brawl, endure, athletics
- REFLEX: shoot, stealth, drive
- WITS: medicine, craft, survival, search
- NERVE: persuade, deceive, intimidate

## EQUIPMENT RULES
- Weapons should match their background
- Most survivors have light or no armor
- Inventory: 2-4 useful items

## OUTPUT FORMAT
Return a JSON object with this exact structure:
{
  "id": "npc-unique-id",
  "name": "Full Name",
  "nickname": null,
  "role": "Their role/profession",
  "age": "mid-30s",
  "appearance": "Physical description (2-3 sentences)",
  "attributes": { "grit": 2, "reflex": 2, "wits": 3, "nerve": 3 },
  "skills": { "medicine": 2, "persuade": 2, "search": 2, "endure": 2 },
  "wounds": { "bruised": 0, "bleeding": 0, "broken": 0, "critical": false },
  "stress": 0,
  "maxStress": 6,
  "weapons": [
    { "name": "Weapon Name", "type": "melee|ranged", "damage": 1, "range": "melee|short|medium|long", "notes": "" }
  ],
  "armor": null,
  "inventory": [
    { "name": "Item", "quantity": 1, "isSignificant": false }
  ],
  "personality": {
    "traits": ["trait1", "trait2"],
    "fears": ["fear1"],
    "motivations": ["motivation1"],
    "quirks": ["quirk1"]
  },
  "attitude": {
    "level": "neutral|friendly|suspicious|hostile|trusted",
    "score": 0,
    "reasons": ["reason1"]
  },
  "secrets": ["secret1"],
  "backstory": "Their history before the outbreak (2-3 sentences)",
  "currentGoals": ["goal1", "goal2"],
  "isAlive": true,
  "status": "healthy",
  "firstMet": {
    "day": 1,
    "location": "Location name",
    "circumstances": "How they met the player"
  },
  "significantEvents": [],
  "isGenerated": true,
  "generatedFrom": "encounter"
}`;

// Call the AI provider
async function callAI(messages: Array<{ role: string; content: string }>): Promise<string> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (anthropicKey) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-latest',
        max_tokens: 2048,
        messages: messages.map(m => ({
          role: m.role === 'system' ? 'user' : m.role,
          content: m.role === 'system' ? `[System Instructions]\n${m.content}` : m.content
        }))
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  if (openaiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages.map(m => ({
          role: m.role as 'system' | 'user' | 'assistant',
          content: m.content
        })),
        max_tokens: 2048,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  if (geminiKey) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          generationConfig: {
            maxOutputTokens: 2048,
            responseMimeType: 'application/json'
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error('No AI API key configured');
}

// Parse JSON from AI response
function parseJSONResponse(text: string): FullNPC {
  // Try to extract JSON from markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch && jsonMatch[1]) {
    return JSON.parse(jsonMatch[1].trim());
  }

  // Try to find JSON object directly
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch && objectMatch[0]) {
    return JSON.parse(objectMatch[0]);
  }

  throw new Error('Could not parse JSON from AI response');
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting
    const rateLimitResult = checkRateLimit(user.id, RATE_LIMITS.gm);
    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult, RATE_LIMITS.gm, 'NPC generate API');
    }

    // Parse request
    const body: GenerateNPCRequest = await request.json();
    const { npcSummary, gameState } = body;

    if (!npcSummary || !npcSummary.name) {
      return NextResponse.json(
        { error: 'Missing NPC summary' },
        { status: 400 }
      );
    }

    // Build context prompt
    const contextPrompt = `Generate a complete NPC for INFECTED TTRPG.

## NPC TO GENERATE
- **Name**: ${npcSummary.name}
- **Role**: ${npcSummary.role || 'Survivor'}
${npcSummary.personality ? `- **Personality Hint**: ${npcSummary.personality}` : ''}
- **How They Join**: ${npcSummary.context}

## CURRENT GAME CONTEXT
- **Day**: ${gameState.day}
- **Location**: ${gameState.location.name}
- **Player Character**: ${gameState.character.name} (${gameState.character.background})
- **Current Threat Level**: ${gameState.threat}/10

Generate a complete NPC that fits this context. Their attitude should reflect the circumstances of how they're joining.`;

    // Call AI
    const messages = [
      { role: 'system', content: NPC_GENERATION_SYSTEM_PROMPT },
      { role: 'user', content: contextPrompt }
    ];

    const aiResponse = await callAI(messages);
    const npc = parseJSONResponse(aiResponse);

    // Ensure required fields
    npc.id = npc.id || `npc-${Date.now()}`;
    npc.isGenerated = true;
    npc.generatedFrom = 'encounter';
    npc.firstMet = {
      day: gameState.day,
      location: gameState.location.name,
      circumstances: npcSummary.context
    };

    const response: GenerateNPCResponse = { npc };

    return NextResponse.json(response, {
      headers: {
        ...createRateLimitHeaders(rateLimitResult, RATE_LIMITS.gm),
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('NPC generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
