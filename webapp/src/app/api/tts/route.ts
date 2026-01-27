import { NextRequest, NextResponse } from 'next/server';
import { 
  checkRateLimit, 
  getClientIdentifier, 
  RATE_LIMITS, 
  createRateLimitResponse,
  createRateLimitHeaders 
} from '@/lib/rate-limit';

// ElevenLabs voice IDs - horror-appropriate voices
const VOICES = {
  // Deep, ominous male voice - great for horror narration
  adam: 'pNInz6obpgDQGcFmaJgB',
  // Gravelly, intense male voice
  arnold: 'VR6AewLTigWG4xSOukaG', 
  // Deep authoritative male voice
  antoni: 'ErXwobaYiN019PkySvjV',
  // Mysterious female voice
  rachel: '21m00Tcm4TlvDq8ikWAM',
  // Dramatic narrator voice
  clyde: '2EiwWnXFnvU5JabPnv8n',
};

// Default to a deep, ominous voice for horror GM
const DEFAULT_VOICE = VOICES.adam;

// ElevenLabs model - turbo for faster response, multilingual for quality
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

    // Validate voiceId if provided
    if (voiceId && typeof voiceId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid voice ID' },
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

    // Call ElevenLabs API
    const voice = voiceId || DEFAULT_VOICE;
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
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
        'Cache-Control': 'public, max-age=86400, immutable', // Cache for 24h, immutable since same text = same audio
        ...rateLimitHeaders,
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    // Don't expose internal error details
    return NextResponse.json(
      { 
        error: 'Failed to generate speech',
        details: 'Speech service unavailable'
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  const hasKey = !!process.env.ELEVENLABS_API_KEY;
  
  return NextResponse.json({
    status: 'ok',
    provider: hasKey ? 'elevenlabs' : 'browser-fallback',
    configured: hasKey,
    voices: Object.keys(VOICES),
  });
}
