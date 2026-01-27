import { NextRequest, NextResponse } from 'next/server';
import { 
  checkRateLimit, 
  getClientIdentifier, 
  RATE_LIMITS, 
  createRateLimitResponse,
  createRateLimitHeaders 
} from '@/lib/rate-limit';

// Image generation types
interface ImageGenerationRequest {
  type: 'portrait' | 'scene';
  prompt: string;
  characterName?: string;
  characterBackground?: string;
  sceneDescription?: string;
}

interface ImageGenerationResponse {
  imageUrl: string;
  revisedPrompt?: string;
  error?: string;
}

// Style presets for consistent horror aesthetic
const STYLE_PRESETS = {
  portrait: {
    base: 'cinematic portrait, dramatic lighting, post-apocalyptic survivor, gritty realistic style, dark atmospheric mood, zombie apocalypse setting',
    negative: 'cartoon, anime, gore, blood, wounds, deformed, distorted, blurry, text, watermark, signature'
  },
  scene: {
    base: 'cinematic scene, post-apocalyptic environment, abandoned, desolate, dramatic lighting, atmospheric fog, horror mood, professional photography',
    negative: 'cartoon, anime, gore, people, zombies, monsters, text, watermark, bright cheerful, colorful'
  }
};

// Build optimized prompt for character portraits
function buildPortraitPrompt(
  characterName: string,
  background: string,
  details?: string
): string {
  const backgroundDescriptions: Record<string, string> = {
    survivor: 'weathered civilian with resourceful look',
    soldier: 'military veteran with tactical gear and dog tags',
    medic: 'medical professional with scrubs or white coat',
    mechanic: 'blue collar worker with grease stains and work clothes',
    scout: 'stealthy figure in dark practical clothing',
    leader: 'charismatic figure with commanding presence',
    hunter: 'rugged outdoorsman in camo or earth tones',
    criminal: 'street-smart figure with leather jacket',
    veterinarian: 'animal care professional with gentle eyes',
    professor: 'intellectual figure with glasses',
    enforcer: 'intimidating figure with muscular build',
    ranger: 'wilderness expert in outdoor gear'
  };

  const backgroundDesc = backgroundDescriptions[background.toLowerCase()] || 'hardened survivor';
  
  const prompt = `Portrait of ${characterName}, a ${backgroundDesc}, ${details || 'determined expression'}, ${STYLE_PRESETS.portrait.base}`;
  
  return prompt;
}

// Build optimized prompt for scene images
function buildScenePrompt(
  locationName: string,
  description: string,
  timeOfDay?: string,
  mood?: string
): string {
  const timeDescriptions: Record<string, string> = {
    dawn: 'early morning golden hour light, misty',
    day: 'harsh daylight, high contrast shadows',
    dusk: 'orange sunset light, long shadows',
    night: 'moonlit darkness, blue tones, shadows'
  };

  const moodDescriptions: Record<string, string> = {
    tense: 'suspenseful atmosphere, something lurking',
    safe: 'momentary calm, but danger nearby',
    dangerous: 'immediate threat, ominous presence',
    desolate: 'empty, abandoned, lonely'
  };

  const timeDesc = timeDescriptions[timeOfDay || 'day'] || 'harsh daylight';
  const moodDesc = moodDescriptions[mood || 'tense'] || 'suspenseful atmosphere';

  const prompt = `${locationName}, ${description}, ${timeDesc}, ${moodDesc}, ${STYLE_PRESETS.scene.base}`;
  
  return prompt;
}

// Generate image using OpenAI DALL-E 3
async function generateWithOpenAI(prompt: string, type: 'portrait' | 'scene'): Promise<ImageGenerationResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const size = type === 'portrait' ? '1024x1024' : '1792x1024'; // Portrait is square, scenes are wide
  
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-image-1.5',
      prompt: prompt,
      n: 1,
      size: size,
      quality: 'standard',
      style: 'vivid',
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('OpenAI Image API error:', error);
    throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  
  return {
    imageUrl: data.data[0].url,
    revisedPrompt: data.data[0].revised_prompt
  };
}

// Generate image using Replicate (Stable Diffusion XL)
async function generateWithReplicate(prompt: string, type: 'portrait' | 'scene'): Promise<ImageGenerationResponse> {
  const apiKey = process.env.REPLICATE_API_TOKEN;
  
  if (!apiKey) {
    throw new Error('Replicate API token not configured');
  }

  // Use SDXL for better quality
  const modelVersion = 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';
  
  const aspectRatio = type === 'portrait' ? '1:1' : '16:9';
  const negativePrompt = type === 'portrait' 
    ? STYLE_PRESETS.portrait.negative 
    : STYLE_PRESETS.scene.negative;

  // Start the prediction
  const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${apiKey}`,
    },
    body: JSON.stringify({
      version: modelVersion.split(':')[1],
      input: {
        prompt: prompt,
        negative_prompt: negativePrompt,
        width: type === 'portrait' ? 1024 : 1344,
        height: type === 'portrait' ? 1024 : 768,
        num_inference_steps: 30,
        guidance_scale: 7.5,
        scheduler: 'K_EULER',
      },
    }),
  });

  if (!createResponse.ok) {
    const error = await createResponse.json().catch(() => ({}));
    console.error('Replicate API error:', error);
    throw new Error(error.detail || `Replicate API error: ${createResponse.status}`);
  }

  const prediction = await createResponse.json();
  
  // Poll for completion (max 60 seconds)
  const maxAttempts = 30;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statusResponse = await fetch(prediction.urls.get, {
      headers: {
        'Authorization': `Token ${apiKey}`,
      },
    });
    
    if (!statusResponse.ok) {
      throw new Error('Failed to check prediction status');
    }
    
    const status = await statusResponse.json();
    
    if (status.status === 'succeeded') {
      const imageUrl = Array.isArray(status.output) ? status.output[0] : status.output;
      return { imageUrl };
    }
    
    if (status.status === 'failed') {
      throw new Error(status.error || 'Image generation failed');
    }
    
    attempts++;
  }
  
  throw new Error('Image generation timed out');
}

// Generate image using Google Gemini 3 Pro Image Preview
async function generateWithGemini(prompt: string, type: 'portrait' | 'scene'): Promise<ImageGenerationResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const aspectRatio = type === 'portrait' ? '1:1' : '16:9';
  const negativePrompt = type === 'portrait' 
    ? STYLE_PRESETS.portrait.negative 
    : STYLE_PRESETS.scene.negative;

  // Use gemini-3-pro-image-preview for image generation
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate an image: ${prompt}\n\nAvoid: ${negativePrompt}\n\nAspect ratio: ${aspectRatio}`
          }]
        }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('Gemini Image API error:', error);
    throw new Error(error.error?.message || `Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  
  // Extract image from response
  const imagePart = data.candidates?.[0]?.content?.parts?.find(
    (part: { inlineData?: { mimeType: string; data: string } }) => part.inlineData
  );
  
  if (!imagePart?.inlineData) {
    // Check if there's an error message in the response
    const textPart = data.candidates?.[0]?.content?.parts?.find(
      (part: { text?: string }) => part.text
    );
    if (textPart?.text) {
      console.error('Gemini returned text instead of image:', textPart.text);
    }
    throw new Error('No image returned from Gemini');
  }
  
  // Return as data URL (Gemini returns base64)
  const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  
  return { imageUrl };
}

// Sanitize text input
function sanitizeInput(input: string, maxLength: number = 500): string {
  return input
    .slice(0, maxLength)
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
}

export async function POST(request: NextRequest) {
  // Rate limiting - images are expensive, strict limit
  const clientId = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(`image:${clientId}`, RATE_LIMITS.image);
  
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult, RATE_LIMITS.image, 'Image API');
  }

  try {
    const body = await request.json() as ImageGenerationRequest;
    const { type, prompt: rawPrompt, characterName, characterBackground, sceneDescription } = body;

    if (!type || !['portrait', 'scene'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "portrait" or "scene"' },
        { status: 400 }
      );
    }

    // Sanitize all inputs
    const sanitizedPrompt = rawPrompt ? sanitizeInput(rawPrompt, 200) : undefined;
    const sanitizedName = characterName ? sanitizeInput(characterName, 50) : undefined;
    const sanitizedBackground = characterBackground ? sanitizeInput(characterBackground, 50) : undefined;
    const sanitizedSceneDesc = sceneDescription ? sanitizeInput(sceneDescription, 500) : undefined;

    // Build optimized prompt based on type
    let finalPrompt: string;
    
    if (type === 'portrait') {
      if (!sanitizedName || !sanitizedBackground) {
        return NextResponse.json(
          { error: 'Portrait requires characterName and characterBackground' },
          { status: 400 }
        );
      }
      finalPrompt = buildPortraitPrompt(sanitizedName, sanitizedBackground, sanitizedPrompt);
    } else {
      if (!sanitizedSceneDesc) {
        return NextResponse.json(
          { error: 'Scene requires sceneDescription' },
          { status: 400 }
        );
      }
      // Parse scene details from sceneDescription
      const parts = sanitizedSceneDesc.split('|').map(s => s.trim());
      const locationName = parts[0] || 'Post-apocalyptic location';
      const description = parts[1] || sanitizedSceneDesc;
      const timeOfDay = parts[2] || 'day';
      const mood = parts[3] || 'tense';
      
      finalPrompt = buildScenePrompt(locationName, description, timeOfDay, mood);
    }

    console.log(`Generating ${type} image with prompt:`, finalPrompt.substring(0, 100) + '...');

    // Try OpenAI first, then Gemini, then Replicate
    let result: ImageGenerationResponse;
    
    if (process.env.OPENAI_API_KEY) {
      result = await generateWithOpenAI(finalPrompt, type);
    } else if (process.env.GEMINI_API_KEY) {
      result = await generateWithGemini(finalPrompt, type);
    } else if (process.env.REPLICATE_API_TOKEN) {
      result = await generateWithReplicate(finalPrompt, type);
    } else {
      return NextResponse.json(
        { error: 'No image generation API configured. Set OPENAI_API_KEY, GEMINI_API_KEY, or REPLICATE_API_TOKEN.' },
        { status: 500 }
      );
    }

    // Return result with rate limit headers and cache headers
    const rateLimitHeaders = createRateLimitHeaders(rateLimitResult, RATE_LIMITS.image);
    const response = NextResponse.json(result);
    
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    // Cache generated images for 1 hour
    response.headers.set('Cache-Control', 'public, max-age=3600');
    
    return response;
  } catch (error) {
    console.error('Image generation error:', error);
    // Don't expose internal error details
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: 'Image generation service unavailable'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasReplicate = !!process.env.REPLICATE_API_TOKEN;
  
  return NextResponse.json({
    status: 'ok',
    providers: {
      openai: hasOpenAI ? 'gpt-image-1.5' : false,
      gemini: hasGemini ? 'gemini-3-pro-image-preview' : false,
      replicate: hasReplicate ? 'sdxl' : false
    },
    configured: hasOpenAI || hasGemini || hasReplicate,
    priority: hasOpenAI ? 'openai' : hasGemini ? 'gemini' : hasReplicate ? 'replicate' : 'none'
  });
}
