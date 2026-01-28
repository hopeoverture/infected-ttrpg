import { NextRequest, NextResponse } from 'next/server';
import { GM_SYSTEM_PROMPT, buildContextualPrompt } from '@/lib/ai/gm-prompt';
import { rollDicePool, rollOpposed, rollInfectionCheck, rollBreakingPoint } from '@/lib/game-engine/dice';
import { GameState, RollResult, AttributeName, SkillName, GMStateChanges } from '@/lib/types';
import { 
  checkRateLimit, 
  getClientIdentifier, 
  RATE_LIMITS, 
  createRateLimitResponse,
  createRateLimitHeaders 
} from '@/lib/rate-limit';

// Types for GM responses
interface GMRoll {
  type: 'skill' | 'opposed' | 'damage' | 'infection' | 'breaking';
  attribute: AttributeName;
  skill: SkillName;
  modifier?: number;
  reason?: string;
  difficulty?: number;
  isPush?: boolean;
}

interface AudioCues {
  music?: string | null;
  soundEffects?: string[];
}

interface GMResponse {
  narrative: string;
  stateChanges: GMStateChanges;
  roll: GMRoll | null;
  combatStarted?: boolean;
  infectionCheck?: boolean;
  breakingPoint?: boolean;
  sceneChanged?: boolean;
  sceneDescription?: string | null;
  audio?: AudioCues | null;
}

// Execute a dice roll based on GM's request
function executeRoll(
  roll: GMRoll,
  gameState: GameState
): { result: RollResult; description: string } {
  const character = gameState.character;
  const attribute = character.attributes[roll.attribute];
  const skill = character.skills[roll.skill] || 0;
  const modifier = roll.modifier || 0;
  
  // Calculate wound penalties (only outside combat)
  let woundPenalty = 0;
  if (!gameState.combatState) {
    if (character.wounds.broken > 0) {
      woundPenalty = -2;
    } else if (character.wounds.bleeding > 0) {
      woundPenalty = -1;
    }
  }
  
  const totalPool = Math.max(1, attribute + skill + modifier + woundPenalty);
  
  let result: RollResult;
  let description: string;
  
  switch (roll.type) {
    case 'infection': {
      const infectionResult = rollInfectionCheck(character.attributes.grit, character.skills.endure || 0);
      result = infectionResult.result;
      description = `Infection Check: ${infectionResult.outcome.toUpperCase()}`;
      if (infectionResult.outcome === 'infected') {
        description += ` - Symptoms in ${infectionResult.symptomsIn} minutes, turning in ${infectionResult.turnedIn} minutes`;
      } else if (infectionResult.outcome === 'fighting') {
        description += ` - Symptoms in ${infectionResult.symptomsIn} minutes (treatable)`;
      }
      break;
    }
    case 'breaking': {
      const breakingResult = rollBreakingPoint(character.attributes.nerve, character.skills.resolve || 0);
      result = breakingResult.result;
      description = `Breaking Point: ${breakingResult.outcome.toUpperCase()}`;
      if (breakingResult.stressCleared === Infinity) {
        description += ' - All stress cleared';
      } else {
        description += ` - ${breakingResult.stressCleared} stress cleared`;
      }
      break;
    }
    case 'opposed': {
      const opposedResult = rollOpposed(totalPool, roll.difficulty || 2);
      result = opposedResult.attackerResult;
      description = `${roll.reason || 'Opposed Roll'}: ${opposedResult.winner === 'attacker' ? 'WIN' : opposedResult.winner === 'defender' ? 'LOSE' : 'TIE'} (Margin: ${opposedResult.margin})`;
      break;
    }
    default: {
      result = rollDicePool(totalPool, roll.isPush);
      description = `${roll.attribute.toUpperCase()} + ${roll.skill}: ${result.description}`;
    }
  }
  
  return { result, description };
}

// Call the AI provider
async function callAI(messages: Array<{ role: string; content: string }>): Promise<string> {
  // Try Anthropic first, then OpenAI
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  
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
        system: messages.find(m => m.role === 'system')?.content || '',
        messages: messages
          .filter(m => m.role !== 'system')
          .map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
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
          content: m.content,
        })),
        max_tokens: 2048,
        response_format: { type: 'json_object' },
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
  
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const chatMessages = messages.filter(m => m.role !== 'system');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemMessage }] },
          contents: chatMessages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
          generationConfig: {
            maxOutputTokens: 2048,
            responseMimeType: 'application/json',
          },
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
  
  throw new Error('No AI API key configured. Set ANTHROPIC_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY in .env.local');
}

// Parse GM response from AI
function parseGMResponse(text: string): GMResponse {
  // Try to extract JSON from the response
  let jsonText = text;
  
  // Handle markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch?.[1]) {
    jsonText = jsonMatch[1].trim();
  }
  
  // Try to find JSON object in the text
  const objectMatch = jsonText.match(/\{[\s\S]*\}/);
  if (objectMatch?.[0]) {
    jsonText = objectMatch[0];
  }
  
  try {
    const parsed = JSON.parse(jsonText);
    return {
      narrative: parsed.narrative || 'The GM is silent...',
      stateChanges: parsed.stateChanges || {},
      roll: parsed.roll || null,
      combatStarted: parsed.combatStarted || false,
      infectionCheck: parsed.infectionCheck || false,
      breakingPoint: parsed.breakingPoint || false,
      sceneChanged: parsed.sceneChanged || false,
      sceneDescription: parsed.sceneDescription || null,
      audio: parsed.audio || null,
    };
  } catch (e) {
    console.error('Failed to parse GM response:', e, '\nRaw text:', text);
    // Return the text as narrative if JSON parsing fails
    return {
      narrative: text,
      stateChanges: {},
      roll: null,
      audio: null,
    };
  }
}

// Build conversation history for context
function buildConversationHistory(gameState: GameState): Array<{ role: string; content: string }> {
  const messages: Array<{ role: string; content: string }> = [];
  
  // Take last 10 messages for context (to avoid token limits)
  const recentMessages = gameState.messages.slice(-10);
  
  for (const msg of recentMessages) {
    if (msg.role === 'gm') {
      messages.push({ role: 'assistant', content: msg.content });
    } else if (msg.role === 'player') {
      messages.push({ role: 'user', content: msg.content });
    }
  }
  
  return messages;
}

// Input validation helpers
function sanitizeAction(action: string): string {
  // Limit length and strip any potential control characters
  return action
    .slice(0, 2000) // Max 2000 chars
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control chars
    .trim();
}

function validateGameState(state: unknown): state is GameState {
  if (!state || typeof state !== 'object') return false;
  const s = state as Record<string, unknown>;
  return (
    typeof s.id === 'string' &&
    typeof s.character === 'object' &&
    s.character !== null &&
    typeof s.day === 'number' &&
    typeof s.threat === 'number'
  );
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(`gm:${clientId}`, RATE_LIMITS.gm);
  
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult, RATE_LIMITS.gm, 'GM API');
  }

  try {
    const body = await request.json();
    const { action, gameState, rollResult } = body as {
      action: string;
      gameState: GameState;
      rollResult?: RollResult;
    };
    
    if (!action || !gameState) {
      return NextResponse.json(
        { error: 'Missing required fields: action and gameState' },
        { status: 400 }
      );
    }

    // Validate and sanitize inputs
    if (typeof action !== 'string' || action.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    if (!validateGameState(gameState)) {
      return NextResponse.json(
        { error: 'Invalid game state' },
        { status: 400 }
      );
    }

    // Sanitize user action to prevent prompt injection
    const sanitizedAction = sanitizeAction(action);
    
    // Build the messages for the AI
    const systemPrompt = GM_SYSTEM_PROMPT;
    const contextPrompt = buildContextualPrompt({
      character: {
        name: gameState.character.name,
        background: gameState.character.background,
        motivation: gameState.character.motivation,
        attributes: gameState.character.attributes,
        skills: gameState.character.skills,
        wounds: gameState.character.wounds,
        stress: gameState.character.stress,
        guts: gameState.character.guts,
        inventory: gameState.character.inventory,
        weapons: gameState.character.weapons,
        armor: gameState.character.armor,
        food: gameState.character.food,
        water: gameState.character.water,
      },
      world: {
        day: gameState.day,
        time: gameState.time,
        location: gameState.location,
        threat: gameState.threat,
        threatState: gameState.threatState,
      },
      party: gameState.party,
      objectives: gameState.objectives,
      combatState: gameState.combatState,
    }, gameState.scenarioId); // Pass scenario ID for story guidance
    
    // Build conversation history
    const history = buildConversationHistory(gameState);
    
    // Construct the user message using sanitized action
    let userMessage = `PLAYER ACTION: ${sanitizedAction}`;
    if (rollResult) {
      userMessage += `\n\nDICE ROLL RESULT:\n${JSON.stringify(rollResult, null, 2)}`;
      userMessage += `\n\nTotal Hits: ${rollResult.totalHits} - ${rollResult.description}`;
    }
    
    const messages = [
      { role: 'system', content: systemPrompt + '\n\n' + contextPrompt },
      ...history,
      { role: 'user', content: userMessage },
    ];
    
    // Call the AI
    const aiResponse = await callAI(messages);
    
    // Parse the response
    const gmResponse = parseGMResponse(aiResponse);
    
    // If a roll is requested, execute it server-side
    let executedRoll: { result: RollResult; description: string } | null = null;
    if (gmResponse.roll) {
      executedRoll = executeRoll(gmResponse.roll, gameState);
    }
    
    // Return the response with rate limit headers
    const response = NextResponse.json({
      narrative: gmResponse.narrative,
      stateChanges: gmResponse.stateChanges,
      roll: executedRoll ? {
        ...gmResponse.roll,
        result: executedRoll.result,
        description: executedRoll.description,
      } : null,
      combatStarted: gmResponse.combatStarted,
      infectionCheck: gmResponse.infectionCheck,
      breakingPoint: gmResponse.breakingPoint,
      sceneChanged: gmResponse.sceneChanged,
      sceneDescription: gmResponse.sceneDescription,
      audio: gmResponse.audio, // Music and sound effect cues
      rawRollRequest: gmResponse.roll, // Include original request for follow-up
    });
    
    // Add rate limit headers and no-cache for dynamic content
    const headers = createRateLimitHeaders(rateLimitResult, RATE_LIMITS.gm);
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    
    return response;
  } catch (error) {
    console.error('GM API error:', error);
    // Don't expose internal error details to clients
    return NextResponse.json(
      { 
        error: 'Failed to process GM response',
        // Only expose safe error messages
        details: error instanceof Error && 
          (error.message.includes('API key') || error.message.includes('configured'))
          ? 'AI service not configured'
          : 'Internal error'
      },
      { status: 500 }
    );
  }
}

// Optional: Handle GET for health check
export async function GET() {
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  
  return NextResponse.json({
    status: 'ok',
    provider: hasAnthropicKey ? 'anthropic' : hasOpenAIKey ? 'openai' : hasGeminiKey ? 'gemini' : 'none',
    configured: hasAnthropicKey || hasOpenAIKey || hasGeminiKey,
  });
}
