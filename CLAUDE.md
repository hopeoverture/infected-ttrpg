# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

INFECTED is a solo survival horror TTRPG (tabletop role-playing game) with an AI Game Master. Players create characters and engage in narrative-driven survival experiences in an apocalyptic, infected world.

## Development Commands

All commands run from the `webapp/` directory:

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run Vitest in watch mode
npm run test:run     # Run tests once (CI)
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 16 with App Router, React 19, Tailwind CSS 4
- **Database**: Supabase PostgreSQL with Row-Level Security
- **Auth**: Supabase Auth (Email + OAuth)
- **AI**: Claude API (primary), with OpenAI and Google Gemini fallbacks
- **Audio**: ElevenLabs TTS, scene images via DALL-E/Replicate/Gemini

### Directory Structure (webapp/src/)
- `app/` - Next.js App Router pages and API routes
- `app/api/gm/` - Main GM response endpoint (AI-powered)
- `app/api/image/` - Scene/portrait image generation
- `app/api/tts/` - Text-to-speech narration
- `components/game/` - Game UI components (25+ files)
- `hooks/` - Custom React hooks (useGameSession, useAudioNarration, etc.)
- `lib/types.ts` - Central type definitions
- `lib/ai/gm-prompt.ts` - GM system prompt with complete game rules
- `lib/game-engine/` - Core TTRPG mechanics (dice rolling, damage, etc.)
- `lib/supabase/` - Database client and operations
- `lib/scenarios.ts` - 10+ premade story scenarios

### Database Tables
- `profiles` - User profiles (extends auth.users)
- `games` - Game sessions with JSONB columns for character, location, party, objectives, combat_state
- `messages` - Narrative history with role (gm/player/system) and optional roll_data

All tables use RLS policies enforcing user ownership.

### API Flow
1. Player action → POST `/api/gm`
2. Rate limit check (10 req/min)
3. Build GM prompt with game rules + current state
4. Call Claude API
5. Return JSON: narrative, stateChanges, roll requests, audio cues, scene triggers

### Key Hooks
- `useGameSession()` - Game state management and API calls
- `useAudioNarration()` - TTS playback control
- `useGameAudio()` - Sound effects and ambient music
- `useKeyboardShortcuts()` - Input handling

## Game Mechanics (TTRPG Rules)

Understanding these rules is essential for working with the GM prompt and game engine:

### Dice System
- D6 pool: Roll Attribute + Skill dice
- 5-6 = Hit
- Exploding 6s: Each 6 adds a bonus die (max +3)
- Results: 0 hits (Failure), 1 hit (Partial), 2 hits (Success), 3+ hits (Strong Success)

### Attributes (1-4 scale)
- GRIT: strength, toughness, melee
- REFLEX: speed, agility, ranged
- WITS: perception, intelligence, tech
- NERVE: willpower, social, stress

### Threat System (0-10)
- 0-2: SAFE → 3-4: NOTICED → 5-6: INVESTIGATING → 7-8: ENCOUNTER → 9-10: SWARM

### Wound Track
- Bruised (4 + GRIT slots) → Bleeding (3) → Broken (2) → Critical (1 = death)

### Stress & Guts
- Stress (0-6): From horror, close calls, losing allies
- Guts (max 5): Hero points for rerolls, damage reduction, finding items

## Environment Variables

Required in `webapp/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
ANTHROPIC_API_KEY          # Primary AI provider
OPENAI_API_KEY             # Fallback
GEMINI_API_KEY             # Fallback
ELEVENLABS_API_KEY         # Optional TTS
```

## Rate Limits

- GM API: 10 requests/minute
- Image generation: 5 requests/minute
- TTS: 20 requests/minute
