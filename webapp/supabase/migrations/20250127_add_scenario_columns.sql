-- Add scenario tracking columns to games table
-- These columns enable premade scenario story guidance

ALTER TABLE games 
ADD COLUMN IF NOT EXISTS scenario_id TEXT,
ADD COLUMN IF NOT EXISTS scenario_data JSONB;

-- Index for scenario lookups
CREATE INDEX IF NOT EXISTS idx_games_scenario_id ON games(scenario_id);

COMMENT ON COLUMN games.scenario_id IS 'ID of the premade scenario being played (e.g., day-one-classic, hospital-outbreak)';
COMMENT ON COLUMN games.scenario_data IS 'Cached scenario data including NPCs, story beats, and tone guidance';
