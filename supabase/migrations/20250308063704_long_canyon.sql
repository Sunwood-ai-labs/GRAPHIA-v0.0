/*
  # Remove username field from profiles

  1. Changes
    - Remove username column from profiles table as we're using email instead
*/

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE profiles DROP COLUMN username;
  END IF;
END $$;