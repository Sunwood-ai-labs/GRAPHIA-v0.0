/*
  # Add username column to profiles

  1. Changes
    - Add `username` column to `profiles` table if it doesn't exist
    - Set default username from email for existing records
    - Make username required and unique
    - Add RLS policy for username management

  2. Notes
    - Check if column exists before adding
    - Ensure data consistency by setting defaults
    - Add appropriate constraints
    - Set up proper RLS policies
*/

-- Add username column only if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'username'
  ) THEN
    -- Add username column
    ALTER TABLE profiles ADD COLUMN username text;

    -- Set default username from email for existing records
    UPDATE profiles 
    SET username = SPLIT_PART(email, '@', 1)
    WHERE username IS NULL;

    -- Make username required and unique
    ALTER TABLE profiles 
      ALTER COLUMN username SET NOT NULL,
      ADD CONSTRAINT profiles_username_unique UNIQUE (username);

    -- Add RLS policy for username management if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'profiles' AND policyname = 'Users can update their own username'
    ) THEN
      CREATE POLICY "Users can update their own username"
        ON profiles
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
    END IF;
  END IF;
END $$;