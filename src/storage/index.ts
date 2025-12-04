/**
 * Object Storage Module
 * 
 * Provides file storage capabilities for the expense tracking app.
 * Supports storing media files (images, videos, audio) in the app's private storage.
 * 
 * Features:
 * - Cross-platform support (Native via Capacitor Filesystem, Web via IndexedDB)
 * - Private storage not accessible by other apps
 * - Support for media attachments in transaction records
 * - Metadata tracking with custom fields
 * - Automatic file type detection
 * 
 * @example
 * ```typescript
 * import { initializeStorage, storeFile, retrieveFile } from '@/storage'
 * 
 * // Initialize storage (call once at app startup)
 * await initializeStorage()
 * 
 * // Store a file
 * const result = await storeFile(base64Data, 'image/jpeg', {
 *   directory: 'receipts',
 *   metadata: { transactionId: '123' }
 * })
 * 
 * // Retrieve a file
 * if (result.success) {
 *   const file = await retrieveFile(result.file.id, true)
 *   if (file.success) {
 *     imageElement.src = file.objectUrl
 *   }
 * }
 * ```
 */

export {
  // Service functions
  initializeStorage,
  isStorageInitialized,
  storeFile,
  retrieveFile,
  deleteFile,
  listFiles,
  getFileMetadata,
  getFileUrl,
  revokeFileUrl,
  getTotalStorageSize,
  clearStorage,
  
  // Types
  type FileMetadata,
  type StorageOptions,
  type StoreResult,
  type RetrieveResult,
  type DeleteResult,
  type ListResult,
  type StorageError,
  type StorageResult,
  
  // Enums
  MediaType,
  StorageErrorCode,
  
  // Utility functions
  getMediaTypeFromMime,
  getExtensionFromMime
} from './StorageService'
