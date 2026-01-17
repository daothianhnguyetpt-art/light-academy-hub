-- Add meeting_id and meeting_password columns to live_classes
ALTER TABLE public.live_classes 
ADD COLUMN IF NOT EXISTS meeting_id TEXT,
ADD COLUMN IF NOT EXISTS meeting_password TEXT;

-- Insert 3 daily meditation sessions for tomorrow
INSERT INTO public.live_classes (
  title, 
  description,
  meeting_platform,
  meeting_url,
  meeting_id,
  meeting_password,
  scheduled_at,
  duration_minutes,
  status,
  category
) VALUES 
(
  'Thiền Cộng Hưởng Năng Lượng - Buổi Sáng',
  'ZOOM THIỀN CỘNG HƯỞNG NĂNG LƯỢNG – Cùng tham gia cộng hưởng năng lượng tích cực mỗi ngày! Kính mời cả nhà tham gia buổi thiền định để nạp năng lượng cho ngày mới.',
  'zoom',
  'https://zoom.us/j/8808082024',
  '88 08 08 2024',
  '999',
  (CURRENT_DATE + INTERVAL '1 day' + TIME '05:00:00') AT TIME ZONE 'Asia/Ho_Chi_Minh',
  120,
  'scheduled',
  'meditation'
),
(
  'Thiền Cộng Hưởng Năng Lượng - Buổi Trưa',
  'ZOOM THIỀN CỘNG HƯỞNG NĂNG LƯỢNG – Cùng tham gia cộng hưởng năng lượng tích cực mỗi ngày! Nghỉ trưa thư giãn và tái tạo năng lượng cùng cộng đồng.',
  'zoom',
  'https://zoom.us/j/8808082024',
  '88 08 08 2024',
  '999',
  (CURRENT_DATE + INTERVAL '1 day' + TIME '12:00:00') AT TIME ZONE 'Asia/Ho_Chi_Minh',
  120,
  'scheduled',
  'meditation'
),
(
  'Thiền Cộng Hưởng Năng Lượng - Buổi Tối',
  'ZOOM THIỀN CỘNG HƯỞNG NĂNG LƯỢNG – Cùng tham gia cộng hưởng năng lượng tích cực mỗi ngày! Thư giãn cuối ngày, thanh lọc tâm trí và chuẩn bị cho giấc ngủ ngon.',
  'zoom',
  'https://zoom.us/j/8808082024',
  '88 08 08 2024',
  '999',
  (CURRENT_DATE + INTERVAL '1 day' + TIME '20:00:00') AT TIME ZONE 'Asia/Ho_Chi_Minh',
  120,
  'scheduled',
  'meditation'
);