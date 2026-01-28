-- Migration: Dynamic Scenario Generation & Enhanced NPC System
-- Adds tables for game preferences, generated scenarios, and NPC history tracking

-- ============================================
-- New Table: game_preferences
-- Stores player preferences for game generation
-- ============================================

CREATE TABLE IF NOT EXISTS public.game_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,

    -- Difficulty settings
    difficulty TEXT NOT NULL DEFAULT 'standard'
        CHECK (difficulty IN ('easy', 'standard', 'challenging', 'brutal')),

    -- Theme preferences (array of selected themes)
    themes JSONB DEFAULT '[]'::jsonb,

    -- Play style focus (percentages that should sum to 100)
    roleplay_focus INTEGER DEFAULT 33 CHECK (roleplay_focus >= 0 AND roleplay_focus <= 100),
    story_focus INTEGER DEFAULT 34 CHECK (story_focus >= 0 AND story_focus <= 100),
    combat_focus INTEGER DEFAULT 33 CHECK (combat_focus >= 0 AND combat_focus <= 100),

    -- Tone preferences
    tone TEXT DEFAULT 'balanced'
        CHECK (tone IN ('hopeful', 'balanced', 'grim', 'nihilistic')),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for game_preferences
ALTER TABLE public.game_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view preferences for own games"
    ON public.game_preferences FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.games
        WHERE games.id = game_preferences.game_id
        AND games.user_id = auth.uid()
    ));

CREATE POLICY "Users can create preferences for own games"
    ON public.game_preferences FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.games
        WHERE games.id = game_preferences.game_id
        AND games.user_id = auth.uid()
    ));

CREATE POLICY "Users can update preferences for own games"
    ON public.game_preferences FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.games
        WHERE games.id = game_preferences.game_id
        AND games.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete preferences for own games"
    ON public.game_preferences FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.games
        WHERE games.id = game_preferences.game_id
        AND games.user_id = auth.uid()
    ));

-- ============================================
-- New Table: generated_scenarios
-- Stores AI-generated scenario options and selected scenario
-- ============================================

CREATE TABLE IF NOT EXISTS public.generated_scenarios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,

    -- The 3 options generated (JSONB array)
    scenario_options JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Which option was selected (0, 1, or 2)
    selected_option INTEGER CHECK (selected_option >= 0 AND selected_option <= 2),

    -- The fully generated scenario after selection
    full_scenario JSONB,

    -- Generation metadata
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    finalized_at TIMESTAMPTZ
);

-- RLS for generated_scenarios
ALTER TABLE public.generated_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view scenarios for own games"
    ON public.generated_scenarios FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.games
        WHERE games.id = generated_scenarios.game_id
        AND games.user_id = auth.uid()
    ));

CREATE POLICY "Users can create scenarios for own games"
    ON public.generated_scenarios FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.games
        WHERE games.id = generated_scenarios.game_id
        AND games.user_id = auth.uid()
    ));

CREATE POLICY "Users can update scenarios for own games"
    ON public.generated_scenarios FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.games
        WHERE games.id = generated_scenarios.game_id
        AND games.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete scenarios for own games"
    ON public.generated_scenarios FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.games
        WHERE games.id = generated_scenarios.game_id
        AND games.user_id = auth.uid()
    ));

-- ============================================
-- New Table: npc_history
-- Tracks NPC state changes over time for efficient retrieval
-- ============================================

CREATE TABLE IF NOT EXISTS public.npc_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    npc_id TEXT NOT NULL,

    -- State snapshot at this point
    state_snapshot JSONB NOT NULL,

    -- What changed
    change_type TEXT NOT NULL CHECK (change_type IN (
        'joined', 'left', 'wounded', 'healed', 'attitude_change',
        'equipment_change', 'death', 'turned', 'revealed_secret'
    )),
    change_description TEXT,

    -- When this happened in-game
    game_day INTEGER NOT NULL,
    game_time TEXT,

    -- Message that triggered the change
    message_id UUID REFERENCES public.messages(id),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient NPC history queries
CREATE INDEX IF NOT EXISTS idx_npc_history_game_npc ON public.npc_history(game_id, npc_id);
CREATE INDEX IF NOT EXISTS idx_npc_history_game_day ON public.npc_history(game_id, game_day);

-- RLS for npc_history
ALTER TABLE public.npc_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view NPC history for own games"
    ON public.npc_history FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.games
        WHERE games.id = npc_history.game_id
        AND games.user_id = auth.uid()
    ));

CREATE POLICY "Users can create NPC history for own games"
    ON public.npc_history FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.games
        WHERE games.id = npc_history.game_id
        AND games.user_id = auth.uid()
    ));

-- ============================================
-- Add full-text search to messages
-- ============================================

ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS
    search_vector tsvector
    GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;

CREATE INDEX IF NOT EXISTS idx_messages_search ON public.messages USING GIN(search_vector);

-- Function to search game messages
CREATE OR REPLACE FUNCTION search_game_messages(
    p_game_id UUID,
    p_query TEXT,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(id UUID, content TEXT, role TEXT, created_at TIMESTAMPTZ, rank REAL) AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.id, m.content, m.role, m.created_at,
        ts_rank(m.search_vector, websearch_to_tsquery('english', p_query)) as rank
    FROM public.messages m
    WHERE m.game_id = p_game_id
        AND m.search_vector @@ websearch_to_tsquery('english', p_query)
    ORDER BY rank DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Update games table with new columns
-- ============================================

ALTER TABLE public.games
ADD COLUMN IF NOT EXISTS preferences_id UUID REFERENCES public.game_preferences(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS generated_scenario_id UUID REFERENCES public.generated_scenarios(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS last_saved_at TIMESTAMPTZ DEFAULT NOW();

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_games_preferences ON public.games(preferences_id);
CREATE INDEX IF NOT EXISTS idx_games_generated_scenario ON public.games(generated_scenario_id);
