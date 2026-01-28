# INFECTED - Solo TTRPG Survival Horror

A web-based solo tabletop roleplaying game set in a post-apocalyptic world overrun by the infected. An AI Game Master guides your survival journey through narrative-driven gameplay with dice mechanics, character progression, and atmospheric storytelling.

## What is INFECTED?

INFECTED is a solo TTRPG (Tabletop Role-Playing Game) where you play as a survivor in a world devastated by an unknown infection. Unlike traditional TTRPGs that require a human Game Master, INFECTED uses AI to:

- **Narrate your story** - Describe scenes, NPCs, and consequences of your actions
- **Run game mechanics** - Roll dice, track wounds, manage threat levels
- **React to your choices** - The AI adapts the narrative based on your decisions
- **Create emergent gameplay** - Each playthrough is unique

## Features

### Core Gameplay
- 🎲 **Dice Pool System** - Roll d6s, count hits (5-6), with exploding 6s
- 💀 **Wound Tracking** - Bruised → Bleeding → Broken → Critical wound ladder
- 😰 **Stress & Breaking Points** - Push your luck, but risk mental breaks
- ☣️ **Infection Mechanics** - Get bitten? Roll to fight off the infection
- 🎭 **12 Unique Backgrounds** - Soldier, Medic, Scout, Criminal, and more
- 🗺️ **Dynamic Threat System** - Safe → Noticed → Investigating → Encounter → Swarm

### Immersive Experience
- 🖼️ **AI-Generated Scene Art** - Visualize locations with procedurally generated images
- 👤 **Character Portraits** - Create your survivor's appearance with AI art
- 🔊 **Voice Narration** - Optional TTS brings the GM to life (via ElevenLabs)
- 🎵 **Ambient Audio** - Dynamic music and sound effects based on tension
- 📖 **Story Scenarios** - Pre-made story hooks or create your own

### Technical Features
- 💾 **Cloud Saves** - Your game persists across sessions (via Supabase)
- 📱 **Mobile Responsive** - Play on desktop or mobile
- ⌨️ **Keyboard Shortcuts** - Quick actions for power users
- 🌙 **Dark Theme** - Easy on the eyes for long sessions

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL + Auth)
- **AI Providers:**
  - Anthropic Claude (preferred for GM)
  - OpenAI GPT-4o (fallback)
  - Google Gemini (fallback)
- **Image Generation:**
  - OpenAI DALL-E / gpt-image
  - Google Gemini Image
  - Replicate (SDXL)
- **Text-to-Speech:** ElevenLabs (optional, falls back to Web Speech API)
- **Testing:** Vitest

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project (free tier works)
- At least one AI API key (Anthropic, OpenAI, or Gemini)

### Setup

1. **Clone and install dependencies:**
   ```bash
   cd projects/infected-ttrpg/webapp
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and fill in your keys:
   ```env
   # Required: Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # Required: At least one AI provider
   ANTHROPIC_API_KEY=your-key  # Recommended
   # OR
   OPENAI_API_KEY=your-key
   # OR
   GEMINI_API_KEY=your-key
   
   # Optional: Enhanced features
   ELEVENLABS_API_KEY=your-key  # Voice narration
   ```

3. **Set up Supabase database:**
   
   Run the SQL migrations in your Supabase project's SQL editor. See `supabase/` directory for schema.

4. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## Project Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── gm/           # AI Game Master endpoint
│   │   ├── image/        # Scene/portrait image generation
│   │   └── tts/          # Text-to-speech endpoint
│   ├── game/[id]/        # Active game session
│   ├── new/              # Character creation
│   └── page.tsx          # Dashboard (game list)
│
├── components/            # React components
│   ├── game/             # Game-specific components
│   │   ├── CharacterPanel.tsx
│   │   ├── CombatTracker.tsx
│   │   ├── DiceRoll.tsx
│   │   └── ...
│   └── ErrorBoundary.tsx # Error handling
│
├── hooks/                 # Custom React hooks
│   ├── useGameSession.ts # Core game state management
│   ├── useAudioNarration.ts
│   └── ...
│
└── lib/                   # Shared utilities
    ├── ai/               # AI prompt engineering
    ├── game-engine/      # Dice rolling, mechanics
    ├── supabase/         # Database client & queries
    └── types.ts          # TypeScript types
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test     # Run tests (watch mode)
npm run test:run # Run tests once
```

## Game Mechanics Quick Reference

### Dice Rolls
- Roll **Attribute + Skill** dice (d6s)
- **5-6** = Hit
- **6** = Explodes (roll another die)
- **0 hits** with majority 1s = Critical Failure

### Wound Levels
1. **Bruised** (4+ slots) - Minor injuries
2. **Bleeding** (3 slots) - Needs treatment
3. **Broken** (2 slots) - Serious injury
4. **Critical** (1 slot) - Death's door

### Guts (Hero Points)
Earn guts for dramatic moments. Spend to:
- Reroll failed dice
- Reduce incoming damage
- Find exactly what you need
- Dramatic flashbacks

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Self-Hosted
```bash
npm run build
npm run start
```

Requires Node.js 20+ and environment variables configured.

## Contributing

This is a personal project, but feel free to:
- Report bugs via issues
- Suggest features
- Submit PRs for improvements

## License

Private project. All rights reserved.

---

*"In the end, it's not about surviving the infected. It's about staying human."*
