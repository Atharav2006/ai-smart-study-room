-- Add user_id column to existing session_history table
ALTER TABLE session_history 
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add index for user_id
CREATE INDEX IF NOT EXISTS idx_session_history_user_id ON session_history(user_id);

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read session history" ON session_history;
DROP POLICY IF EXISTS "Allow authenticated users to insert session history" ON session_history;

-- Create new policies that filter by user_id
CREATE POLICY "Users can read their own session history"
ON session_history FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own session history"
ON session_history FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
