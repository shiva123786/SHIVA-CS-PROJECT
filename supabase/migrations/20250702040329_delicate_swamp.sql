/*
  # Complete Database Schema Setup

  1. New Tables
    - `events` - Core events table
    - `registrations` - User registrations
    - `contact_messages` - Contact form submissions
    - `sponsorship_inquiries` - Sponsorship requests
    - `gallery` - Gallery items
    - `departments` - Department reference data
    - `department_admins` - Department admin users
    - `event_media` - Media files for events
    - `media_collections` - Media organization
    - `collection_media` - Media collection relationships
    
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
    - Ensure proper access control
    
  3. Features
    - Complete event management system
    - User registration and contact forms
    - Department-based admin system
    - Media upload and management
    - Gallery functionality
*/

-- Create events table first
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  time time NOT NULL,
  location text NOT NULL,
  image_url text,
  max_participants integer DEFAULT 100,
  current_participants integer DEFAULT 0,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  registration_deadline date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  age integer,
  city text,
  talent_category text NOT NULL,
  experience text,
  motivation text,
  previous_events text,
  social_media text,
  emergency_contact text,
  emergency_phone text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at timestamptz DEFAULT now()
);

-- Create sponsorship inquiries table
CREATE TABLE IF NOT EXISTS sponsorship_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  website text,
  sponsorship_type text NOT NULL,
  budget text NOT NULL,
  message text,
  interests text[],
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Create gallery table
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

-- Create departments reference table
CREATE TABLE IF NOT EXISTS departments (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  color_scheme text,
  icon text,
  background_image text,
  created_at timestamptz DEFAULT now()
);

-- Insert department data
INSERT INTO departments (id, name, description, color_scheme, icon, background_image) VALUES
('social-responsibility', 'Social Responsibility (SR)', 'Community service and social impact initiatives', 'from-green-500 to-emerald-600', '🤝', 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800'),
('environmental', 'Environmental', 'Environmental conservation and sustainability programs', 'from-green-600 to-teal-700', '🌱', 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800'),
('sustainable-rural-development', 'Sustainable Rural Development (SRD)', 'Rural development and agricultural sustainability', 'from-amber-500 to-orange-600', '🌾', 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=800'),
('education', 'Education', 'Educational programs and literacy initiatives', 'from-blue-500 to-indigo-600', '📚', 'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=800'),
('gender-equality', 'Gender Equality (GE)', 'Promoting gender equality and women empowerment', 'from-purple-500 to-pink-600', '⚖️', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800'),
('health-hygiene-wellbeing', 'Health Hygiene And Well-Being', 'Health awareness and wellness programs', 'from-red-500 to-rose-600', '🏥', 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT (id) DO NOTHING;

-- Create department admins table
CREATE TABLE IF NOT EXISTS department_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  department_id text REFERENCES departments(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'moderator')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, department_id)
);

-- Add department_id to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS department_id text REFERENCES departments(id);

-- Create event media table
CREATE TABLE IF NOT EXISTS event_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  media_type text NOT NULL CHECK (media_type IN ('photo', 'video', 'poster', 'document')),
  media_url text NOT NULL,
  thumbnail_url text,
  file_size bigint,
  mime_type text,
  department_id text REFERENCES departments(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_featured boolean DEFAULT false,
  is_public boolean DEFAULT true,
  tags text[],
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create media collections table for organizing media
CREATE TABLE IF NOT EXISTS media_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  department_id text REFERENCES departments(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create junction table for media collections
CREATE TABLE IF NOT EXISTS collection_media (
  collection_id uuid REFERENCES media_collections(id) ON DELETE CASCADE,
  media_id uuid REFERENCES event_media(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  PRIMARY KEY (collection_id, media_id)
);

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsorship_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_media ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Events are viewable by everyone"
  ON events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true);

-- Policies for registrations
CREATE POLICY "Anyone can create registrations"
  ON registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update registrations"
  ON registrations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for contact messages
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for sponsorship inquiries
CREATE POLICY "Anyone can create sponsorship inquiries"
  ON sponsorship_inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view sponsorship inquiries"
  ON sponsorship_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update sponsorship inquiries"
  ON sponsorship_inquiries
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for gallery
CREATE POLICY "Gallery is viewable by everyone"
  ON gallery
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage gallery"
  ON gallery
  FOR ALL
  TO authenticated
  USING (true);

-- Policies for departments (public read)
CREATE POLICY "Departments are viewable by everyone"
  ON departments
  FOR SELECT
  TO public
  USING (true);

-- Policies for department_admins
CREATE POLICY "Department admins can view their own records"
  ON department_admins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage department admins"
  ON department_admins
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM department_admins da
      WHERE da.user_id = auth.uid() AND da.role = 'admin'
    )
  );

-- Policies for event_media
CREATE POLICY "Public media is viewable by everyone"
  ON event_media
  FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Department admins can manage their department media"
  ON event_media
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM department_admins da
      WHERE da.user_id = auth.uid() 
      AND da.department_id = event_media.department_id
      AND da.is_active = true
    )
  );

CREATE POLICY "Media uploaders can manage their own uploads"
  ON event_media
  FOR ALL
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- Policies for media_collections
CREATE POLICY "Public collections are viewable by everyone"
  ON media_collections
  FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Department admins can manage their department collections"
  ON media_collections
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM department_admins da
      WHERE da.user_id = auth.uid() 
      AND da.department_id = media_collections.department_id
      AND da.is_active = true
    )
  );

-- Policies for collection_media
CREATE POLICY "Collection media inherits collection permissions"
  ON collection_media
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM media_collections mc
      JOIN department_admins da ON da.department_id = mc.department_id
      WHERE mc.id = collection_media.collection_id
      AND da.user_id = auth.uid()
      AND da.is_active = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_department ON events(department_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_sponsorship_inquiries_status ON sponsorship_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_department_admins_user_dept ON department_admins(user_id, department_id);
CREATE INDEX IF NOT EXISTS idx_event_media_department ON event_media(department_id);
CREATE INDEX IF NOT EXISTS idx_event_media_event ON event_media(event_id);
CREATE INDEX IF NOT EXISTS idx_event_media_type ON event_media(media_type);
CREATE INDEX IF NOT EXISTS idx_event_media_public ON event_media(is_public);
CREATE INDEX IF NOT EXISTS idx_media_collections_department ON media_collections(department_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_admins_updated_at
  BEFORE UPDATE ON department_admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_media_updated_at
  BEFORE UPDATE ON event_media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();