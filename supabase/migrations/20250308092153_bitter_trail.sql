/*
  # Fix database relations and structure

  1. Changes
    - Drop existing tables and views to ensure clean state
    - Recreate tables with correct relations
    - Add proper foreign key constraints
    - Recreate views and functions
  
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Drop existing objects
DROP VIEW IF EXISTS ranked_files_by_views;
DROP FUNCTION IF EXISTS get_tag_rankings();
DROP FUNCTION IF EXISTS get_prompt_rankings();
DROP TABLE IF EXISTS html_files;
DROP TABLE IF EXISTS profiles;

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create html_files table with proper foreign key
CREATE TABLE html_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  content text NOT NULL,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  tags text[] DEFAULT '{}',
  prompt_name text,
  reference_url text,
  opacity numeric DEFAULT 0.5,
  CONSTRAINT html_files_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES profiles(id) ON DELETE CASCADE
);

ALTER TABLE html_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HTML files are viewable by everyone"
  ON html_files
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own HTML files"
  ON html_files
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own HTML files"
  ON html_files
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own HTML files"
  ON html_files
  FOR DELETE
  USING (auth.uid() = user_id);

-- Recreate view with proper join
CREATE VIEW ranked_files_by_views AS
SELECT 
  f.*,
  p.username,
  RANK() OVER (ORDER BY f.views DESC) as rank
FROM html_files f
JOIN profiles p ON f.user_id = p.id;

-- Recreate functions
CREATE OR REPLACE FUNCTION get_tag_rankings()
RETURNS TABLE (
  tag text,
  usage_count bigint,
  rank bigint
) AS $$
BEGIN
  RETURN QUERY
  WITH tag_counts AS (
    SELECT UNNEST(tags) as tag, COUNT(*) as usage_count
    FROM html_files
    GROUP BY tag
  )
  SELECT 
    tc.tag,
    tc.usage_count,
    RANK() OVER (ORDER BY tc.usage_count DESC) as rank
  FROM tag_counts tc
  ORDER BY tc.usage_count DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_prompt_rankings()
RETURNS TABLE (
  prompt_name text,
  usage_count bigint,
  rank bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.prompt_name,
    COUNT(*) as usage_count,
    RANK() OVER (ORDER BY COUNT(*) DESC) as rank
  FROM html_files h
  WHERE h.prompt_name IS NOT NULL
  GROUP BY h.prompt_name
  ORDER BY usage_count DESC;
END;
$$ LANGUAGE plpgsql;