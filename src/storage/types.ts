/**
 * Types and interfaces for the object storage system
 * 
 * This module provides type definitions for file storage operations,
 * supporting media attachments for transaction records.
 */

/**
 * Supported media types for storage
 */
export enum MediaType {
  /** Image files (JPEG, PNG, GIF, WebP, etc.) */
  IMAGE = 'image',
  /** Video files (MP4, WebM, etc.) */
  VIDEO = 'video',
  /** Audio files (MP3, WAV, OGG, etc.) */
  AUDIO = 'audio',
  /** Other binary files */
  OTHER = 'other'
}

/**
 * Options for storing a file
 */
export interface StorageOptions {
  /** Optional custom filename (without extension). If not provided, a UUID will be generated */
  filename?: string
  /** Subdirectory within the storage area (e.g., 'transactions', 'receipts') */
  directory?: string
  /** Optional metadata to associate with the file */
  metadata?: Record<string, unknown>
}

/**
 * Metadata stored alongside each file
 */
export interface FileMetadata {
  /** Unique identifier for the stored file */
  id: string
  /** Original filename (if provided) or generated UUID */
  filename: string
  /** Full relative path within storage */
  path: string
  /** MIME type of the file */
  mimeType: string
  /** Media type classification */
  mediaType: MediaType
  /** File size in bytes */
  size: number
  /** Timestamp when the file was stored */
  createdAt: string
  /** Optional custom metadata */
  metadata?: Record<string, unknown>
}

/**
 * Result of a successful file storage operation
 */
export interface StoreResult {
  /** Whether the operation was successful */
  success: true
  /** Metadata of the stored file */
  file: FileMetadata
}

/**
 * Result of a file retrieval operation
 */
export interface RetrieveResult {
  /** Whether the operation was successful */
  success: true
  /** Metadata of the file */
  file: FileMetadata
  /** File data as base64 encoded string */
  data: string
  /** Object URL for web access (valid until revoked) */
  objectUrl?: string
}

/**
 * Result of a file deletion operation
 */
export interface DeleteResult {
  /** Whether the operation was successful */
  success: true
  /** ID of the deleted file */
  id: string
}

/**
 * Result of listing files
 */
export interface ListResult {
  /** Whether the operation was successful */
  success: true
  /** Array of file metadata */
  files: FileMetadata[]
}

/**
 * Error result for storage operations
 */
export interface StorageError {
  /** Whether the operation was successful */
  success: false
  /** Error message */
  error: string
  /** Error code for programmatic handling */
  code: StorageErrorCode
}

/**
 * Error codes for storage operations
 */
export enum StorageErrorCode {
  /** File not found */
  NOT_FOUND = 'NOT_FOUND',
  /** Invalid file type */
  INVALID_TYPE = 'INVALID_TYPE',
  /** Storage quota exceeded */
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  /** Permission denied */
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  /** Generic I/O error */
  IO_ERROR = 'IO_ERROR',
  /** Invalid input data */
  INVALID_INPUT = 'INVALID_INPUT',
  /** Storage not initialized */
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  /** Unknown error */
  UNKNOWN = 'UNKNOWN'
}

/**
 * Union type for all possible storage operation results
 */
export type StorageResult<T> = T | StorageError

/**
 * MIME type to MediaType mapping helper
 */
export function getMediaTypeFromMime(mimeType: string): MediaType {
  if (mimeType.startsWith('image/')) {
    return MediaType.IMAGE
  }
  if (mimeType.startsWith('video/')) {
    return MediaType.VIDEO
  }
  if (mimeType.startsWith('audio/')) {
    return MediaType.AUDIO
  }
  return MediaType.OTHER
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMime(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    // Images
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/bmp': '.bmp',
    // Videos
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/ogg': '.ogv',
    'video/quicktime': '.mov',
    'video/x-msvideo': '.avi',
    // Audio
    'audio/mpeg': '.mp3',
    'audio/ogg': '.ogg',
    'audio/wav': '.wav',
    'audio/webm': '.weba',
    'audio/aac': '.aac',
    'audio/flac': '.flac',
    // Others
    'application/pdf': '.pdf',
    'application/json': '.json',
    'text/plain': '.txt'
  }
  
  return mimeToExt[mimeType] || ''
}
