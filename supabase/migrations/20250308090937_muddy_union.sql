/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `username` (text)
      - `created_at` (timestamp)
    - `html_files`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `content` (text)
      - `views` (integer)
      - `created_at` (timestamp)
      - `tags` (text[])
      - `prompt_name` (text)
      - `reference_url` (text)
      - `opacity` (numeric)

  2. Views
    - `ranked_files_by_views`: Ranks files by view count
  
  3. Functions
    - `get_tag_rankings`: Returns tag usage statistics
    - `get_prompt_rankings`: Returns prompt usage statistics

  4. Security
    - Enable RLS on all tables
    - Set up appropriate access policies
*/

-- Drop existing view if it exists to avoid column name conflicts
DROP VIEW IF EXISTS ranked_files_by_views;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Public profiles are viewable by everyone'
  ) THEN
    CREATE POLICY "Public profiles are viewable by everyone"
      ON profiles
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles
      FOR UPDATE
      USING (auth.uid() = id);
  END IF;
END $$;

-- Create html_files table
CREATE TABLE IF NOT EXISTS html_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content text NOT NULL,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  tags text[] DEFAULT '{}',
  prompt_name text,
  reference_url text,
  opacity numeric DEFAULT 0.5
);

ALTER TABLE html_files ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'html_files' AND policyname = 'HTML files are viewable by everyone'
  ) THEN
    CREATE POLICY "HTML files are viewable by everyone"
      ON html_files
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'html_files' AND policyname = 'Users can insert their own HTML files'
  ) THEN
    CREATE POLICY "Users can insert their own HTML files"
      ON html_files
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'html_files' AND policyname = 'Users can update their own HTML files'
  ) THEN
    CREATE POLICY "Users can update their own HTML files"
      ON html_files
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'html_files' AND policyname = 'Users can delete their own HTML files'
  ) THEN
    CREATE POLICY "Users can delete their own HTML files"
      ON html_files
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create ranked_files_by_views view after all tables are created
CREATE OR REPLACE VIEW ranked_files_by_views AS
SELECT 
  f.id,
  f.user_id,
  f.title,
  f.description,
  f.content,
  f.views,
  f.created_at,
  f.tags,
  f.prompt_name,
  f.reference_url,
  f.opacity,
  p.username,
  RANK() OVER (ORDER BY f.views DESC) as rank
FROM html_files f
JOIN profiles p ON f.user_id = p.id;

-- Create tag rankings function
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

-- Create prompt rankings function
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