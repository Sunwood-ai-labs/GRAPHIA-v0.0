/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `username` (text)
      - `email` (text)
      - `created_at` (timestamptz)
    - `html_files`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `content` (text)
      - `views` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authentication and data access
    - Create trigger for automatic profile creation
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text,
  email text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create html_files table if it doesn't exist
CREATE TABLE IF NOT EXISTS html_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content text NOT NULL,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on html_files if not already enabled
ALTER TABLE html_files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ BEGIN
  DROP POLICY IF EXISTS "HTML files are viewable by everyone" ON html_files;
  DROP POLICY IF EXISTS "Users can insert their own HTML files" ON html_files;
  DROP POLICY IF EXISTS "Users can update their own HTML files" ON html_files;
  DROP POLICY IF EXISTS "Users can delete their own HTML files" ON html_files;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policies for html_files
CREATE POLICY "HTML files are viewable by everyone"
  ON html_files FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own HTML files"
  ON html_files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own HTML files"
  ON html_files FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own HTML files"
  ON html_files FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function and trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();