-- INFECTED Web App - Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- GAMES
-- ============================================
CREATE TABLE IF NOT EXISTS public.games (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Untitled Game',
    
    -- Character data (JSON for flexibility)
    character JSONB NOT NULL,
    
    -- World state
    day INTEGER NOT NULL DEFAULT 1,
    time_of_day TEXT NOT NULL DEFAULT 'day' CHECK (time_of_day IN ('night', 'dawn', 'day', 'dusk')),
    location JSONB NOT NULL,
    threat INTEGER NOT NULL DEFAULT 0 CHECK (threat >= 0 AND threat <= 10),
    threat_state TEXT NOT NULL DEFAULT 'safe' CHECK (threat_state IN ('safe', 'noticed', 'investigating', 'encounter', 'swarm')),
    
    -- Party and objectives
    party JSONB DEFAULT '[]'::jsonb,
    objectives JSONB DEFAULT '[]'::jsonb,
    
    -- Combat state (null when not in combat)
    combat_state JSONB,
    
    -- Session tracking
    session_start_time TIMESTAMPTZ,
    roll_count INTEGER DEFAULT 0,
    kill_count INTEGER DEFAULT 0,
    
    -- Game status
    is_game_over BOOLEAN DEFAULT FALSE,
    death_day INTEGER,
    death_cause TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Games policies
CREATE POLICY "Users can view own games" ON public.games
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own games" ON public.games
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own games" ON public.games
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own games" ON public.games
    FOR DELETE USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_games_user_id ON public.games(user_id);
CREATE INDEX IF NOT EXISTS idx_games_updated_at ON public.games(updated_at DESC);

-- ============================================
-- MESSAGES (Game narrative history)
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    
    role TEXT NOT NULL CHECK (role IN ('gm', 'player', 'system')),
    content TEXT NOT NULL,
    
    -- Optional roll data
    roll_data JSONB,
    
    -- Ordering
    sequence_num INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Messages policies (inherit from game ownership)
CREATE POLICY "Users can view messages for own games" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.games 
            WHERE games.id = messages.game_id 
            AND games.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert messages for own games" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.games 
            WHERE games.id = messages.game_id 
            AND games.user_id = auth.uid()
        )
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_game_id ON public.messages(game_id);
CREATE INDEX IF NOT EXISTS idx_messages_sequence ON public.messages(game_id, sequence_num);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_games_updated_at
    BEFORE UPDATE ON public.games
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Get next message sequence number
CREATE OR REPLACE FUNCTION get_next_message_sequence(p_game_id UUID)
RETURNS INTEGER AS $$
DECLARE
    next_seq INTEGER;
BEGIN
    SELECT COALESCE(MAX(sequence_num), 0) + 1 INTO next_seq
    FROM public.messages
    WHERE game_id = p_game_id;
    RETURN next_seq;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS
-- ============================================

-- Game summaries for dashboard
CREATE OR REPLACE VIEW public.game_summaries AS
SELECT 
    g.id,
    g.user_id,
    g.title,
    g.character->>'name' as character_name,
    g.character->>'background' as background,
    g.day,
    g.threat,
    g.is_game_over,
    g.death_day,
    g.updated_at,
    g.created_at
FROM public.games g;

-- ============================================
-- SAMPLE DATA (for testing - remove in production)
-- ============================================

-- Uncomment to add sample data after creating a test user:
/*
INSERT INTO public.games (user_id, title, character, location, day, threat) VALUES
(
    'YOUR-USER-UUID-HERE',
    'The Long Road',
    '{
        "id": "char-1",
        "name": "Marcus Chen",
        "background": "soldier",
        "motivation": "Find my sister",
        "attributes": {"grit": 3, "reflex": 3, "wits": 3, "nerve": 3},
        "skills": {"brawl": 2, "endure": 1, "athletics": 1, "shoot": 3, "stealth": 1, "drive": 0, "notice": 1, "craft": 0, "tech": 0, "medicine": 0, "survival": 0, "knowledge": 0, "persuade": 1, "deceive": 0, "resolve": 1, "intimidate": 0, "animals": 0},
        "wounds": {"bruised": 0, "bleeding": 1, "broken": 0, "critical": false},
        "woundCapacity": {"bruised": 5, "bleeding": 3, "broken": 2, "critical": 1},
        "stress": 0,
        "maxStress": 6,
        "guts": 3,
        "gutsEarnedThisSession": 0,
        "inventory": [{"id": "1", "name": "Med kit", "quantity": 2, "isSignificant": true}],
        "weapons": [{"id": "w1", "name": "Pistol", "damage": 3, "range": "Close/Med", "noise": 5, "properties": ["One-Handed", "Loud"], "durability": 5, "maxDurability": 5, "ammo": 12, "maxAmmo": 15}],
        "armor": {"name": "Light Armor", "reduction": 2, "stealthPenalty": 1, "durability": 4, "maxDurability": 4},
        "carryingCapacity": 7,
        "food": 2,
        "water": 1
    }'::jsonb,
    '{
        "name": "Riverside Pharmacy",
        "description": "A ransacked drugstore",
        "lightLevel": "dim",
        "scarcity": "sparse",
        "ambientThreat": 3,
        "searched": false
    }'::jsonb,
    14,
    7
);
*/
