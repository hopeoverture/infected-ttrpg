import { NextRequest, NextResponse } from 'next/server';
import { 
  checkRateLimit, 
  getClientIdentifier, 
  RATE_LIMITS, 
  createRateLimitResponse,
  createRateLimitHeaders 
} from '@/lib/rate-limit';

// ElevenLabs voice IDs - curated for horror/narrative experiences
// All these are available on the free plan (pre-made voices)
export const ELEVENLABS_VOICES = {
  // === MALE VOICES ===
  // Deep & Ominous
  adam: { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', desc: 'Deep & clear', gender: 'male', style: 'narrator' },
  daniel: { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', desc: 'Authoritative British', gender: 'male', style: 'narrator' },
  
  // Gravelly & Intense  
  arnold: { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', desc: 'Gravelly & intense', gender: 'male', style: 'dramatic' },
  clyde: { id: '2EiwWnXFnvU5JabPnv8n', name: 'Clyde', desc: 'War-worn veteran', gender: 'male', style: 'dramatic' },
  
  // Mysterious & Eerie
  marcus: { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Marcus', desc: 'Thoughtful & measured', gender: 'male', style: 'mysterious' },
  james: { id: 'ZQe5CZNOzWyzPSCn5a3c', name: 'James', desc: 'Calm Australian', gender: 'male', style: 'mysterious' },
  
  // Warm & Trustworthy
  liam: { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', desc: 'Young & earnest', gender: 'male', style: 'warm' },
  josh: { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', desc: 'Deep American', gender: 'male', style: 'warm' },
  
  // === FEMALE VOICES ===
  // Mysterious & Haunting
  rachel: { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', desc: 'Calm & composed', gender: 'female', style: 'mysterious' },
  sarah: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', desc: 'Soft & intimate', gender: 'female', style: 'mysterious' },
  
  // Strong & Dramatic
  domi: { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', desc: 'Strong & intense', gender: 'female', style: 'dramatic' },
  bella: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', desc: 'Warm narrator', gender: 'female', style: 'dramatic' },
  
  // Narrator Style
  elli: { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', desc: 'Clear American', gender: 'female', style: 'narrator' },
  charlotte: { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', desc: 'Elegant British', gender: 'female', style: 'narrator' },
  
  // === SPECIAL VOICES ===
  // Unique Character Voices
  callum: { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', desc: 'Intense Scottish', gender: 'male', style: 'character' },
  charlie: { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', desc: 'Casual Australian', gender: 'male', style: 'character' },
  matilda: { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', desc: 'Warm Australian', gender: 'female', style: 'character' },
  fin: { id: 'D38z5RcWu1voky8WS1ja', name: 'Fin', desc: 'Irish storyteller', gender: 'male', style: 'character' },
} as const;

export type VoiceId = keyof typeof ELEVENLABS_VOICES;

// Default to Adam for horror GM narration
const DEFAULT_VOICE: VoiceId = 'adam';

// ElevenLabs model - turbo for faster response
const ELEVENLABS_MODEL = 'eleven_turbo_v2_5';

// Sanitize text for TTS
function sanitizeText(text: string): string {
  return text
    .slice(0, 5000)
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control chars
    .trim();
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(`tts:${clientId}`, RATE_LIMITS.tts);
  
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult, RATE_LIMITS.tts, 'TTS API');
  }

  try {
    const body = await request.json();
    const { text, voiceId } = body as { text: string; voiceId?: string };

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid text field' },
        { status: 400 }
      );
    }

    // Sanitize and limit text length
    const trimmedText = sanitizeText(text);
    
    if (trimmedText.length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;

    // Check if ElevenLabs is configured
    if (!apiKey) {
      // Return a flag indicating client should use Web Speech API fallback
      return NextResponse.json(
        { 
          fallback: true, 
          text: trimmedText,
          message: 'ElevenLabs API key not configured, use browser TTS' 
        },
        { status: 200 }
      );
    }

    // Resolve voice ID - check if it's a known key or use as-is if it looks like an ElevenLabs ID
    let resolvedVoiceId: string;
    if (voiceId && voiceId in ELEVENLABS_VOICES) {
      resolvedVoiceId = ELEVENLABS_VOICES[voiceId as VoiceId].id;
    } else if (voiceId && voiceId.length > 15) {
      // Looks like a raw ElevenLabs voice ID
      resolvedVoiceId = voiceId;
    } else {
      resolvedVoiceId = ELEVENLABS_VOICES[DEFAULT_VOICE].id;
    }

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${resolvedVoiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: trimmedText,
          model_id: ELEVENLABS_MODEL,
          voice_settings: {
            stability: 0.6,        // Slightly lower for more dramatic variation
            similarity_boost: 0.8, // Keep voice character
            style: 0.4,           // Some expressiveness
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      
      // On ElevenLabs error, suggest fallback
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { 
            fallback: true, 
            text: trimmedText,
            message: 'ElevenLabs authentication failed, use browser TTS' 
          },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { error: `ElevenLabs API error: ${response.status}` },
        { status: 500 }
      );
    }

    // Get audio buffer
    const audioBuffer = await response.arrayBuffer();

    // Return audio as MP3 with caching and rate limit headers
    const rateLimitHeaders = createRateLimitHeaders(rateLimitResult, RATE_LIMITS.tts);
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400, immutable',
        ...rateLimitHeaders,
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate speech',
        details: 'Speech service unavailable'
      },
      { status: 500 }
    );
  }
}

// Health check & voice list
export async function GET() {
  const hasKey = !!process.env.ELEVENLABS_API_KEY;
  
  // Return voices grouped by style for easy UI rendering
  const voicesByStyle: Record<string, Array<{ id: string; name: string; desc: string; gender: string }>> = {};
  
  for (const [key, voice] of Object.entries(ELEVENLABS_VOICES)) {
    const style = voice.style;
    if (!voicesByStyle[style]) {
      voicesByStyle[style] = [];
    }
    voicesByStyle[style]!.push({
      id: key,
      name: voice.name,
      desc: voice.desc,
      gender: voice.gender,
    });
  }

  return NextResponse.json({
    status: 'ok',
    provider: hasKey ? 'elevenlabs' : 'browser-fallback',
    configured: hasKey,
    defaultVoice: DEFAULT_VOICE,
    voices: Object.entries(ELEVENLABS_VOICES).map(([key, v]) => ({
      id: key,
      name: v.name,
      desc: v.desc,
      gender: v.gender,
      style: v.style,
    })),
    voicesByStyle,
  });
}
