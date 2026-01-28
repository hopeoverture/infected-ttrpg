import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  SCENARIO_GENERATION_SYSTEM_PROMPT,
  buildScenarioGenerationPrompt
} from '@/lib/ai/scenario-prompts';
import { Character, GamePreferences } from '@/lib/types';
import { ScenarioOption } from '@/lib/types/generated-scenario';
import {
  checkRateLimit,
  RATE_LIMITS,
  createRateLimitResponse,
  createRateLimitHeaders
} from '@/lib/rate-limit';

interface GenerateRequest {
  character: Character;
  preferences: GamePreferences;
}

interface GenerateResponse {
  options: ScenarioOption[];
  generationId: string;
}

// Call the AI provider for scenario generation
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
        max_tokens: 4096,
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
        max_tokens: 4096,
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
            maxOutputTokens: 4096,
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

// Parse JSON from AI response (may be wrapped in markdown)
function parseJSONResponse(text: string): { options: ScenarioOption[] } {
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

    // Rate limiting (use GM rate limit)
    const rateLimitResult = checkRateLimit(user.id, RATE_LIMITS.gm);
    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult, RATE_LIMITS.gm, 'Scenario generate API');
    }

    // Parse request
    const body: GenerateRequest = await request.json();
    const { character, preferences } = body;

    if (!character || !preferences) {
      return NextResponse.json(
        { error: 'Missing character or preferences' },
        { status: 400 }
      );
    }

    // Build prompt
    const userPrompt = buildScenarioGenerationPrompt(character, preferences);

    // Call AI
    const messages = [
      { role: 'system', content: SCENARIO_GENERATION_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ];

    const aiResponse = await callAI(messages);
    const parsed = parseJSONResponse(aiResponse);

    // Generate unique IDs for options if not present
    const options = parsed.options.map((opt, idx) => ({
      ...opt,
      id: opt.id || `scenario-${Date.now()}-${idx}`
    }));

    // Store in database for later finalization
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: scenarioRecord, error: dbError } = await (supabase as any)
      .from('generated_scenarios')
      .insert({
        scenario_options: options
      })
      .select('id')
      .single() as { data: { id: string } | null; error: Error | null };

    if (dbError) {
      console.error('Database error storing scenarios:', dbError);
      // Continue without storing - user can still select
    }

    const response: GenerateResponse = {
      options,
      generationId: scenarioRecord?.id || `temp-${Date.now()}`
    };

    return NextResponse.json(response, {
      headers: {
        ...createRateLimitHeaders(rateLimitResult, RATE_LIMITS.gm),
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Scenario generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
