/*
  # Drop username column from profiles

  1. Changes
    - Drop the `username` column from `profiles` table
    - Drop dependent view `ranked_files_by_views` first
    - Recreate the view without the username column

  2. Notes
    - Using CASCADE is not recommended as it might drop objects we want to keep
    - Instead, we explicitly handle dependencies
*/

-- First drop the dependent view
DROP VIEW IF EXISTS ranked_files_by_views;

-- Then drop the username column if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE profiles DROP COLUMN username;
  END IF;
END $$;

-- Recreate the view without the username column
CREATE OR REPLACE VIEW ranked_files_by_views AS
SELECT 
  f.*,
  p.email,
  ROW_NUMBER() OVER (ORDER BY f.views DESC) as rank
FROM html_files f
LEFT JOIN profiles p ON f.user_id = p.id;