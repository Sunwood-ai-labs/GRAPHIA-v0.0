/*
  # Add metadata columns to html_files table

  1. Changes
    - Add `tags` column (text array) if it doesn't exist
    - Add `prompt_name` column (text) if it doesn't exist
    - Add `reference_url` column (text) if it doesn't exist

  2. Notes
    - Check column existence before adding
    - Set appropriate default values
    - Maintain data consistency
*/

DO $$ 
BEGIN
  -- Add tags column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'html_files' AND column_name = 'tags'
  ) THEN
    ALTER TABLE html_files ADD COLUMN tags text[] DEFAULT '{}';
  END IF;

  -- Add prompt_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'html_files' AND column_name = 'prompt_name'
  ) THEN
    ALTER TABLE html_files ADD COLUMN prompt_name text;
  END IF;

  -- Add reference_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'html_files' AND column_name = 'reference_url'
  ) THEN
    ALTER TABLE html_files ADD COLUMN reference_url text;
  END IF;
END $$;