-- Migration: Add voice settings for multi-voice audio system
-- Adds GM voice selection to games table
-- Adds character voice selection to characters table
-- NPC voice is stored in party JSONB (no schema change needed)

-- Add GM voice setting to games table
ALTER TABLE public.games
ADD COLUMN IF NOT EXISTS gm_voice_id TEXT DEFAULT 'adam';

-- Add comment for documentation
COMMENT ON COLUMN public.games.gm_voice_id IS 'ElevenLabs voice ID for GM narration. Default is adam.';

-- Add character voice setting to characters table
ALTER TABLE public.characters
ADD COLUMN IF NOT EXISTS voice_id TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.characters.voice_id IS 'ElevenLabs voice ID for character dialog. NULL uses default based on gender.';
