-- Insert 5 sample live classes
INSERT INTO live_classes (title, description, scheduled_at, duration_minutes, max_participants, category, status)
VALUES 
  ('Web3 Development Workshop', 
   'Học cách xây dựng ứng dụng phi tập trung trên Ethereum. Bao gồm: Smart Contracts, DApps, và Web3.js',
   NOW() + INTERVAL '2 hours', 
   120, 200, 'Workshop', 'scheduled'),
   
  ('Machine Learning Office Hours', 
   'Buổi hỏi đáp trực tiếp về Machine Learning. Mang theo câu hỏi của bạn!',
   NOW() + INTERVAL '1 day',
   60, 100, 'Office Hours', 'scheduled'),
   
  ('Research Methodology Seminar',
   'Phương pháp nghiên cứu khoa học dành cho nghiên cứu sinh',
   NOW() + INTERVAL '2 days',
   90, 300, 'Seminar', 'scheduled'),
   
  ('Blockchain for Beginners',
   'Giới thiệu cơ bản về công nghệ Blockchain và ứng dụng',
   NOW() + INTERVAL '3 days',
   75, 150, 'Workshop', 'scheduled'),
   
  ('Academic Writing Skills',
   'Kỹ năng viết bài báo khoa học quốc tế',
   NOW() + INTERVAL '5 days',
   90, 200, 'Seminar', 'scheduled');

-- Create class_registrations table
CREATE TABLE IF NOT EXISTS class_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES live_classes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at timestamptz DEFAULT now(),
  reminder_enabled boolean DEFAULT true,
  attended boolean DEFAULT false,
  UNIQUE(class_id, user_id)
);

-- Enable RLS
ALTER TABLE class_registrations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own registrations"
  ON class_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view registration counts"
  ON class_registrations FOR SELECT
  USING (true);

CREATE POLICY "Users can register for classes"
  ON class_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unregister from classes"
  ON class_registrations FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own registrations"
  ON class_registrations FOR UPDATE
  USING (auth.uid() = user_id);