/**
 * File validation utilities for secure file uploads
 */

// Allowed MIME types for different file categories
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/mov',
] as const;

// Maximum file sizes in bytes
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB

// File extension whitelist
export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'] as const;
export const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov'] as const;

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates an image file for upload
 */
export function validateImageFile(file: File): FileValidationResult {
  // Check MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    return {
      isValid: false,
      error: `Invalid image type. Allowed types: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      isValid: false,
      error: `Image too large. Maximum size: ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !ALLOWED_IMAGE_EXTENSIONS.includes(extension as typeof ALLOWED_IMAGE_EXTENSIONS[number])) {
    return {
      isValid: false,
      error: `Invalid file extension. Allowed extensions: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
    };
  }

  return { isValid: true };
}

/**
 * Validates a video file for upload
 */
export function validateVideoFile(file: File): FileValidationResult {
  // Check MIME type
  if (!ALLOWED_VIDEO_TYPES.includes(file.type as typeof ALLOWED_VIDEO_TYPES[number])) {
    return {
      isValid: false,
      error: `Invalid video type. Allowed types: ${ALLOWED_VIDEO_EXTENSIONS.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > MAX_VIDEO_SIZE) {
    return {
      isValid: false,
      error: `Video too large. Maximum size: ${MAX_VIDEO_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !ALLOWED_VIDEO_EXTENSIONS.includes(extension as typeof ALLOWED_VIDEO_EXTENSIONS[number])) {
    return {
      isValid: false,
      error: `Invalid file extension. Allowed extensions: ${ALLOWED_VIDEO_EXTENSIONS.join(', ')}`,
    };
  }

  return { isValid: true };
}

/**
 * Validates a thumbnail file for upload
 */
export function validateThumbnailFile(file: File): FileValidationResult {
  // Check MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    return {
      isValid: false,
      error: `Invalid thumbnail type. Allowed types: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
    };
  }

  // Check file size (smaller limit for thumbnails)
  if (file.size > MAX_THUMBNAIL_SIZE) {
    return {
      isValid: false,
      error: `Thumbnail too large. Maximum size: ${MAX_THUMBNAIL_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !ALLOWED_IMAGE_EXTENSIONS.includes(extension as typeof ALLOWED_IMAGE_EXTENSIONS[number])) {
    return {
      isValid: false,
      error: `Invalid file extension. Allowed extensions: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
    };
  }

  return { isValid: true };
}

/**
 * Sanitizes a filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
  // Remove any path components
  const basename = filename.split(/[/\\]/).pop() || filename;
  
  // Get the extension
  const parts = basename.split('.');
  const extension = parts.length > 1 ? parts.pop()?.toLowerCase() : '';
  const name = parts.join('.');
  
  // Remove any characters that could be problematic
  const sanitizedName = name
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .substring(0, 50); // Limit filename length
  
  return extension ? `${sanitizedName}.${extension}` : sanitizedName;
}

/**
 * Generates a safe filename for upload
 */
export function generateSafeFilename(userId: string, originalFilename: string): string {
  const extension = originalFilename.split('.').pop()?.toLowerCase() || '';
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  
  return `${userId}/${timestamp}_${randomSuffix}.${extension}`;
}
