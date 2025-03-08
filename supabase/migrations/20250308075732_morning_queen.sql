/*
  # Add opacity column to html_files table

  1. Changes
    - Add `opacity` column to `html_files` table with default value of 0.5
    - Set default opacity for existing records
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'html_files' AND column_name = 'opacity'
  ) THEN
    ALTER TABLE html_files ADD COLUMN opacity numeric DEFAULT 0.5;
  END IF;
END $$;