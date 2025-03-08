/*
  # Add username to profiles table

  1. Changes
    - Add `username` column to `profiles` table with default value from email
    - Add unique constraint on username
    - Update RLS policies to allow users to update their own username

  2. Security
    - Maintain existing RLS policies
    - Add policy for username updates
*/

-- Add username column with a default value derived from email
ALTER TABLE profiles ADD COLUMN username text;

-- Set default username from email for existing records
UPDATE profiles 
SET username = SPLIT_PART(email, '@', 1)
WHERE username IS NULL;

-- Make username required and unique
ALTER TABLE profiles 
  ALTER COLUMN username SET NOT NULL,
  ADD CONSTRAINT profiles_username_unique UNIQUE (username);

-- Update RLS policies for username management
CREATE POLICY "Users can update their own username"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);