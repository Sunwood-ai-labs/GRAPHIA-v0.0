/*
  # Add tags, prompt and reference URL fields to html_files table

  1. Changes
    - Add `tags` array field to store multiple tags
    - Add `prompt_name` text field for AI prompt name
    - Add `reference_url` text field for reference URL
*/

ALTER TABLE html_files
ADD COLUMN tags text[] DEFAULT '{}',
ADD COLUMN prompt_name text,
ADD COLUMN reference_url text;