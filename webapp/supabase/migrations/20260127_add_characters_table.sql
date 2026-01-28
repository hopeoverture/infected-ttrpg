-- Migration: Add standalone characters table
-- Allows characters to exist outside of games and be reused

-- Create characters table
CREATE TABLE IF NOT EXISTS public.characters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

    -- Core identity
    name TEXT NOT NULL,
    nickname TEXT,
    background TEXT NOT NULL,

    -- Appearance & portrait
    appearance JSONB NOT NULL DEFAULT '{}'::jsonb,
    portrait_url TEXT,
    art_style TEXT DEFAULT 'cinematic',

    -- Stats (locked after first game use)
    attributes JSONB NOT NULL,
    skills JSONB NOT NULL,

    -- Personality & psychology
    personality JSONB DEFAULT '{}'::jsonb,

    -- Connections & relationships
    connections JSONB DEFAULT '{}'::jsonb,

    -- Story elements
    motivation TEXT NOT NULL,
    moral_code TEXT,
    survival_philosophy TEXT,

    -- Progression (per DESIGN.md)
    skill_points_available INTEGER DEFAULT 0,
    attribute_points_available INTEGER DEFAULT 0,
    scars JSONB DEFAULT '[]'::jsonb,
    sessions_survived INTEGER DEFAULT 0,

    -- Metadata
    times_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own characters
CREATE POLICY "Users can view own characters"
    ON public.characters FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own characters"
    ON public.characters FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters"
    ON public.characters FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters"
    ON public.characters FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON public.characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_updated_at ON public.characters(updated_at DESC);

-- Add source_character_id to games table to track which character template was used
ALTER TABLE public.games
    ADD COLUMN IF NOT EXISTS source_character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_characters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER characters_updated_at_trigger
    BEFORE UPDATE ON public.characters
    FOR EACH ROW
    EXECUTE FUNCTION update_characters_updated_at();
