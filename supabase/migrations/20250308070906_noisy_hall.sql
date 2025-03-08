/*
  # Add ranking views for HTML files

  1. Views
    - `ranked_files_by_views`: Ranks files by view count
    - `ranked_files_by_tags`: Ranks tags by usage
    - `ranked_files_by_prompts`: Ranks prompts by usage

  2. Functions
    - `get_tag_rankings`: Returns tag usage statistics
    - `get_prompt_rankings`: Returns prompt usage statistics
*/

-- Create view for ranking by views
CREATE OR REPLACE VIEW ranked_files_by_views AS
SELECT 
  html_files.*,
  profiles.username,
  ROW_NUMBER() OVER (ORDER BY views DESC) as rank
FROM html_files
JOIN profiles ON html_files.user_id = profiles.id;

-- Create function for tag rankings
CREATE OR REPLACE FUNCTION get_tag_rankings()
RETURNS TABLE (
  tag text,
  usage_count bigint,
  rank bigint
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    UNNEST(tags) as tag,
    COUNT(*) as usage_count,
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as rank
  FROM html_files
  GROUP BY tag;
$$;

-- Create function for prompt rankings
CREATE OR REPLACE FUNCTION get_prompt_rankings()
RETURNS TABLE (
  prompt_name text,
  usage_count bigint,
  rank bigint
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    prompt_name,
    COUNT(*) as usage_count,
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as rank
  FROM html_files
  WHERE prompt_name IS NOT NULL
  GROUP BY prompt_name;
$$;