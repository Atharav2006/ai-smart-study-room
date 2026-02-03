-- Create session_history table to store archived study sessions
CREATE TABLE IF NOT EXISTS session_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id TEXT NOT NULL,
    user_id UUID NOT NULL,
    summary_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    topic TEXT
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_session_history_room_id ON session_history(room_id);
CREATE INDEX IF NOT EXISTS idx_session_history_user_id ON session_history(user_id);
CREATE INDEX IF NOT EXISTS idx_session_history_created_at ON session_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE session_history ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to read only their own session history
CREATE POLICY "Users can read their own session history"
ON session_history FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Allow users to insert their own sessions
CREATE POLICY "Users can insert their own session history"
ON session_history FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
