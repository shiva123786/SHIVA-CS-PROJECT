/*
  # Create gallery table with proper error handling

  1. New Tables
    - `gallery` - Stores gallery items with photos and event information
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `image_url` (text, required)
      - `event_date` (date, optional)
      - `location` (text, optional)
      - `category` (text, default 'general')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `gallery` table
    - Add policies for public viewing and authenticated user management

  3. Sample Data
    - Insert sample gallery items for demonstration
*/

-- Create gallery table if it doesn't exist
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  event_date date,
  location text,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Gallery is viewable by everyone" ON gallery;
  DROP POLICY IF EXISTS "Authenticated users can manage gallery" ON gallery;
  
  -- Create new policies
  CREATE POLICY "Gallery is viewable by everyone"
    ON gallery
    FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Authenticated users can manage gallery"
    ON gallery
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
END $$;

-- Create index for category filtering if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery USING btree (category);

-- Insert sample data only if the table is empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM gallery LIMIT 1) THEN
    INSERT INTO gallery (title, description, image_url, event_date, location, category) VALUES
      ('Voice of Hyderabad 2024', 'Annual voice competition showcasing incredible talent from across the city', 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600', '2024-01-15', 'Hyderabad', 'voice-competitions'),
      ('Cultural Evening', 'A beautiful evening of music, poetry, and cultural performances', 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=600', '2024-02-20', 'Hyderabad', 'cultural-events'),
      ('Community Workshop', 'Voice training and skill development workshop for aspiring artists', 'https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg?auto=compress&cs=tinysrgb&w=600', '2024-03-10', 'Hyderabad', 'workshops'),
      ('Poetry Recitation', 'Heartfelt poetry performances touching souls and inspiring minds', 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=600', '2024-04-05', 'Hyderabad', 'voice-competitions'),
      ('Community Gathering', 'Monthly meetup bringing together all community members', 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=600', '2024-05-15', 'Hyderabad', 'community-gatherings'),
      ('Talent Showcase', 'Platform for emerging artists to showcase their unique talents', 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600', '2024-06-20', 'Hyderabad', 'voice-competitions');
  END IF;
END $$;