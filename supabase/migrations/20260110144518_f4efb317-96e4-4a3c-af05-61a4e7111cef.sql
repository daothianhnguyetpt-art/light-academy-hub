-- Insert sample videos for testing (with correct level values - lowercase)
INSERT INTO videos (title, description, video_url, thumbnail_url, duration_minutes, category, level, institution, views, rating)
VALUES 
  ('Introduction to Machine Learning', 'Khóa học cơ bản về Machine Learning dành cho người mới bắt đầu. Tìm hiểu các khái niệm nền tảng về AI và ứng dụng thực tế.', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800', 45, 'Computer Science', 'beginner', 'MIT', 1250, 4.8),
  
  ('Calculus Fundamentals', 'Nền tảng giải tích cho sinh viên năm nhất. Bao gồm đạo hàm, tích phân và ứng dụng trong khoa học.', 'https://www.youtube.com/watch?v=WUvTyaaNkzM', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800', 60, 'Mathematics', 'beginner', 'Stanford University', 890, 4.6),
  
  ('Quantum Physics Explained', 'Vật lý lượng tử giải thích đơn giản cho người không chuyên. Khám phá thế giới hạ nguyên tử kỳ diệu.', 'https://www.youtube.com/watch?v=p7bzE1E5PMY', 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800', 35, 'Physics', 'intermediate', 'Harvard University', 2100, 4.9),
  
  ('Business Strategy 101', 'Chiến lược kinh doanh cho startup và doanh nghiệp nhỏ. Học cách xây dựng lợi thế cạnh tranh.', 'https://www.youtube.com/watch?v=o77ta5V2bPY', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', 50, 'Business', 'beginner', 'Wharton School', 750, 4.5),
  
  ('Academic English Writing', 'Kỹ năng viết tiếng Anh học thuật cho nghiên cứu sinh và sinh viên đại học quốc tế.', 'https://www.youtube.com/watch?v=vtIzMaLkCaM', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800', 40, 'Languages', 'intermediate', 'Oxford University', 1600, 4.7),
  
  ('Digital Art Fundamentals', 'Cơ bản về nghệ thuật số và thiết kế đồ họa. Sử dụng các công cụ chuyên nghiệp để sáng tạo.', 'https://www.youtube.com/watch?v=oKIBH6U7QGc', 'https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=800', 55, 'Arts', 'beginner', 'Parsons School', 430, 4.4);

-- Create video_bookmarks table
CREATE TABLE IF NOT EXISTS video_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

ALTER TABLE video_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own video bookmarks"
  ON video_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can bookmark videos"
  ON video_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own video bookmarks"
  ON video_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Create video_comments table
CREATE TABLE IF NOT EXISTS video_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE video_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Video comments are viewable by everyone"
  ON video_comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment on videos"
  ON video_comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own video comments"
  ON video_comments FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own video comments"
  ON video_comments FOR DELETE
  USING (auth.uid() = author_id);

-- Create video_ratings table
CREATE TABLE IF NOT EXISTS video_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

ALTER TABLE video_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings are viewable by everyone"
  ON video_ratings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can rate videos"
  ON video_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON video_ratings FOR UPDATE
  USING (auth.uid() = user_id);