/**
 * Meeting & Livestream Utility Functions
 * Handles URL parsing and meeting join functionality for various platforms
 */

// Extract YouTube video ID from various URL formats
export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/live\/([^?&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Generate YouTube embed URL
export function getYoutubeEmbedUrl(url: string): string | null {
  const videoId = extractYoutubeId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

// Generate Facebook embed URL
export function getFacebookEmbedUrl(url: string): string {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true`;
}

// Open meeting/livestream in new tab
export function joinMeeting(url: string | null | undefined): void {
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Get platform display name
export function getPlatformDisplayName(platform: string | null): string {
  switch (platform) {
    case 'zoom':
      return 'Zoom';
    case 'google_meet':
      return 'Google Meet';
    case 'youtube':
      return 'YouTube Live';
    case 'facebook':
      return 'Facebook Live';
    default:
      return 'Meeting';
  }
}

// Get platform color class
export function getPlatformColorClass(platform: string | null): string {
  switch (platform) {
    case 'zoom':
      return 'bg-blue-500';
    case 'google_meet':
      return 'bg-green-500';
    case 'youtube':
      return 'bg-red-600';
    case 'facebook':
      return 'bg-blue-600';
    default:
      return 'bg-primary';
  }
}

// Get platform icon letter
export function getPlatformIcon(platform: string | null): string {
  switch (platform) {
    case 'zoom':
      return 'Z';
    case 'google_meet':
      return 'G';
    case 'youtube':
      return '▶';
    case 'facebook':
      return 'f';
    default:
      return 'M';
  }
}

// Check if platform is a livestream type
export function isLivestreamPlatform(platform: string | null): boolean {
  return platform === 'youtube' || platform === 'facebook';
}

// Check if platform is a meeting type (Zoom/Meet)
export function isMeetingPlatform(platform: string | null): boolean {
  return platform === 'zoom' || platform === 'google_meet';
}
