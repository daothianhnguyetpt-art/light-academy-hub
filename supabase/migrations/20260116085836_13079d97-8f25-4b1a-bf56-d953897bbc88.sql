-- Thêm các trường mới cho tích hợp meeting và livestream
ALTER TABLE live_classes 
ADD COLUMN IF NOT EXISTS meeting_platform text DEFAULT 'zoom',
ADD COLUMN IF NOT EXISTS livestream_url text;

-- Thêm comment để mô tả các giá trị
COMMENT ON COLUMN live_classes.meeting_platform IS 'Platform type: zoom, google_meet, youtube, facebook';
COMMENT ON COLUMN live_classes.livestream_url IS 'Embed URL for YouTube/Facebook livestreams';