# INFECTED — Apocalyptic Survival TTRPG

> *Fast infection. Scarce resources. Every sound is a gamble.*

A solo survival horror TTRPG with an AI Game Master. Inspired by The Last of Us, 28 Days Later, and classic survival horror.

## 🎮 Play Online

Coming soon at: **infected.game** *(placeholder)*

## 📚 Game Documents

| Document | Description |
|----------|-------------|
| [DESIGN.md](./DESIGN.md) | Complete game rules (v1.1.0) |
| [GM-SCREEN.md](./GM-SCREEN.md) | Quick reference for GMs |
| [PLAYER-REFERENCE.md](./PLAYER-REFERENCE.md) | Player quick reference |
| [CHARACTER-SHEET.md](./CHARACTER-SHEET.md) | Printable character sheet |

## 🕹️ Web App

The `/webapp` directory contains a Next.js application that lets you play INFECTED with an AI Game Master.

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Email + OAuth)
- **Styling**: Tailwind CSS 4
- **AI**: Claude/OpenAI integration

### Local Development

```bash
cd webapp
npm install
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the schema in `webapp/supabase/schema.sql` in the SQL Editor
3. Copy your project URL and anon key to `.env.local`

## 🎲 Core Mechanics

- **D6 Dice Pool**: Roll Attribute + Skill, 5-6 = Hit
- **Exploding 6s**: Each 6 adds a bonus die (max +3)
- **Wound Track**: Bruised → Bleeding → Broken → Critical
- **Threat System**: Noise attracts infected (0-10 scale)
- **Fast Infection**: Turn in minutes, not hours
- **Guts**: Meta-currency for clutch moments

## 📖 Quick Start

**Attributes** (1-5): GRIT, REFLEX, WITS, NERVE

**Roll Results**:
| Hits | Result |
|------|--------|
| 0 | Failure |
| 1 | Partial success (complication) |
| 2 | Success |
| 3+ | Strong success |

**Combat**: 
- Melee: GRIT + Brawl
- Ranged: REFLEX + Shoot
- Initiative: NERVE + Notice

## 🏗️ Project Structure

```
infected-ttrpg/
├── DESIGN.md              # Full game rules
├── GM-SCREEN.md           # GM quick reference
├── PLAYER-REFERENCE.md    # Player quick reference
├── CHARACTER-SHEET.md     # Character sheet
└── webapp/                # Next.js web application
    ├── src/
    │   ├── app/           # Pages and routes
    │   ├── components/    # React components
    │   └── lib/           # Game engine, types, Supabase
    └── supabase/          # Database schema
```

## 📜 License

MIT License - feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions welcome! Please open an issue first to discuss changes.

---

*Version 1.1.0 — Designed for tension, tested for survival.*
