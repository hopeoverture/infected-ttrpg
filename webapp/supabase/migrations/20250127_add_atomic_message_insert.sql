-- Migration: Add atomic message insert function
-- This prevents race conditions when multiple messages are added concurrently

-- Create atomic insert function that calculates sequence_num in the same transaction
CREATE OR REPLACE FUNCTION insert_message_atomic(
    p_game_id UUID,
    p_role TEXT,
    p_content TEXT,
    p_roll_data JSONB DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    game_id UUID,
    role TEXT,
    content TEXT,
    roll_data JSONB,
    sequence_num INTEGER,
    created_at TIMESTAMPTZ
) AS $$
DECLARE
    next_seq INTEGER;
    new_id UUID;
    new_created_at TIMESTAMPTZ;
BEGIN
    -- Lock the game row to prevent concurrent sequence number calculations
    PERFORM 1 FROM public.games WHERE games.id = p_game_id FOR UPDATE;

    -- Calculate next sequence number
    SELECT COALESCE(MAX(m.sequence_num), 0) + 1 INTO next_seq
    FROM public.messages m
    WHERE m.game_id = p_game_id;

    -- Insert the message
    INSERT INTO public.messages (game_id, role, content, roll_data, sequence_num)
    VALUES (p_game_id, p_role, p_content, p_roll_data, next_seq)
    RETURNING messages.id, messages.created_at INTO new_id, new_created_at;

    -- Return the inserted row
    RETURN QUERY SELECT
        new_id,
        p_game_id,
        p_role,
        p_content,
        p_roll_data,
        next_seq,
        new_created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION insert_message_atomic TO authenticated;
