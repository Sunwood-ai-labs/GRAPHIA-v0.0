/*
  # Create rankings view and add opacity column

  1. New View
    - Create ranked_files_by_views view
    - Include proper joins with profiles table
    - Add ranking by views

  2. Changes
    - Add opacity column to html_files table
    - Set default opacity value

  3. Notes
    - View combines html_files and profiles data
    - Ranks files by view count
    - Includes user information
*/

-- Add opacity column to html_files if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'html_files' AND column_name = 'opacity'
  ) THEN
    ALTER TABLE html_files ADD COLUMN opacity numeric DEFAULT 0.5;
  END IF;
END $$;

-- Drop the view if it exists
DROP VIEW IF EXISTS ranked_files_by_views;

-- Create the view with proper column references
CREATE VIEW ranked_files_by_views AS
SELECT 
  f.*,
  p.email,
  RANK() OVER (ORDER BY f.views DESC) as rank
FROM html_files f
LEFT JOIN profiles p ON f.user_id = p.id;