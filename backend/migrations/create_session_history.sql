-- Create session_history table to store archived study sessions
CREATE TABLE IF NOT EXISTS session_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id TEXT NOT NULL,
    summary_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    topic TEXT
);

-- Add index for faster queries by room_id
CREATE INDEX IF NOT EXISTS idx_session_history_room_id ON session_history(room_id);
CREATE INDEX IF NOT EXISTS idx_session_history_created_at ON session_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE session_history ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all history
CREATE POLICY "Allow authenticated users to read session history"
ON session_history FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to insert their own sessions
CREATE POLICY "Allow authenticated users to insert session history"
ON session_history FOR INSERT
TO authenticated
WITH CHECK (true);
