/**
 * Object Storage Service
 * 
 * Provides file storage capabilities for the expense tracking app.
 * Uses Capacitor Filesystem on native platforms and IndexedDB on web.
 * Files are stored in the app's private area, not accessible by other apps.
 */

import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import {
  type FileMetadata,
  type StorageOptions,
  type StoreResult,
  type RetrieveResult,
  type DeleteResult,
  type ListResult,
  type StorageError,
  StorageErrorCode,
  MediaType,
  getMediaTypeFromMime,
  getExtensionFromMime
} from './types'

// Constants
const STORAGE_ROOT = 'track-expenses-files'
const METADATA_FILE = '_metadata.json'
const WEB_STORAGE_NAME = 'track-expenses-files'

// LocalForage instance type
type LocalForageInstance = ReturnType<typeof import('localforage').createInstance>

// Web storage instance (IndexedDB via localforage)
let webStorage: LocalForageInstance | null = null

// In-memory metadata cache (synchronized with persistent storage)
let metadataCache: Map<string, FileMetadata> = new Map()
let isInitialized = false
let initPromise: Promise<void> | null = null

/**
 * Check if running on a native platform (Android/iOS)
 */
function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform()
}

/**
 * Get web storage instance
 */
async function getWebStorage(): Promise<LocalForageInstance> {
  if (!webStorage) {
    const { createInstance, INDEXEDDB } = await import('localforage')
    webStorage = createInstance({
      driver: INDEXEDDB,
      name: WEB_STORAGE_NAME
    })
  }
  return webStorage
}

/**
 * Generate a unique file ID
 */
function generateFileId(): string {
  return crypto.randomUUID()
}

/**
 * Get the full path for a file
 */
function getFilePath(directory: string | undefined, filename: string): string {
  if (directory) {
    return `${STORAGE_ROOT}/${directory}/${filename}`
  }
  return `${STORAGE_ROOT}/${filename}`
}

/**
 * Get the metadata storage key
 */
function getMetadataPath(): string {
  return `${STORAGE_ROOT}/${METADATA_FILE}`
}

/**
 * Create a storage error
 */
function createError(code: StorageErrorCode, message: string): StorageError {
  return {
    success: false,
    error: message,
    code
  }
}

/**
 * Load metadata from persistent storage
 */
async function loadMetadata(): Promise<void> {
  try {
    if (isNativePlatform()) {
      try {
        const result = await Filesystem.readFile({
          path: getMetadataPath(),
          directory: Directory.Data,
          encoding: Encoding.UTF8
        })
        const data = typeof result.data === 'string' ? result.data : await result.data.text()
        const metadata = JSON.parse(data) as FileMetadata[]
        metadataCache = new Map(metadata.map((m: FileMetadata) => [m.id, m]))
      } catch {
        // Metadata file doesn't exist yet, start fresh
        metadataCache = new Map()
      }
    } else {
      const storage = await getWebStorage()
      const metadata = await storage.getItem<FileMetadata[]>('__metadata__')
      if (metadata) {
        metadataCache = new Map(metadata.map((m: FileMetadata) => [m.id, m]))
      } else {
        metadataCache = new Map()
      }
    }
  } catch (error) {
    console.error('Failed to load metadata:', error)
    metadataCache = new Map()
  }
}

/**
 * Save metadata to persistent storage
 */
async function saveMetadata(): Promise<void> {
  const metadata = Array.from(metadataCache.values())
  
  try {
    if (isNativePlatform()) {
      // Ensure directory exists
      try {
        await Filesystem.mkdir({
          path: STORAGE_ROOT,
          directory: Directory.Data,
          recursive: true
        })
      } catch {
        // Directory may already exist, ignore error
      }
      
      await Filesystem.writeFile({
        path: getMetadataPath(),
        data: JSON.stringify(metadata),
        directory: Directory.Data,
        encoding: Encoding.UTF8
      })
    } else {
      const storage = await getWebStorage()
      await storage.setItem('__metadata__', metadata)
    }
  } catch (error) {
    console.error('Failed to save metadata:', error)
    throw error
  }
}

/**
 * Initialize the storage service
 * Must be called before using any other storage functions
 */
export async function initializeStorage(): Promise<void> {
  if (isInitialized) {
    return
  }
  
  if (initPromise) {
    return initPromise
  }
  
  initPromise = (async () => {
    try {
      console.log(`Initializing storage for ${isNativePlatform() ? 'native' : 'web'} platform`)
      
      // Ensure storage directories exist on native platforms
      if (isNativePlatform()) {
        try {
          await Filesystem.mkdir({
            path: STORAGE_ROOT,
            directory: Directory.Data,
            recursive: true
          })
        } catch {
          // Directory may already exist, ignore error
        }
      }
      
      // Load existing metadata
      await loadMetadata()
      
      isInitialized = true
      console.log('Storage initialized successfully')
    } catch (error) {
      console.error('Storage initialization failed:', error)
      initPromise = null
      throw error
    }
  })()
  
  return initPromise
}

/**
 * Check if storage is initialized
 */
export function isStorageInitialized(): boolean {
  return isInitialized
}

/**
 * Store a file in the app's private storage
 * 
 * @param data - File data as base64 encoded string (without data URL prefix)
 * @param mimeType - MIME type of the file
 * @param options - Storage options
 * @returns StoreResult on success, StorageError on failure
 * 
 * @example
 * ```typescript
 * // Store a receipt image
 * const result = await storeFile(base64Data, 'image/jpeg', {
 *   directory: 'receipts',
 *   metadata: { transactionId: '123' }
 * })
 * if (result.success) {
 *   console.log('Stored file:', result.file.id)
 * }
 * ```
 */
export async function storeFile(
  data: string,
  mimeType: string,
  options: StorageOptions = {}
): Promise<StoreResult | StorageError> {
  if (!isInitialized) {
    return createError(StorageErrorCode.NOT_INITIALIZED, 'Storage not initialized. Call initializeStorage() first.')
  }
  
  if (!data || typeof data !== 'string') {
    return createError(StorageErrorCode.INVALID_INPUT, 'Invalid data: must be a non-empty base64 encoded string.')
  }
  
  if (!mimeType || typeof mimeType !== 'string') {
    return createError(StorageErrorCode.INVALID_INPUT, 'Invalid mimeType: must be a non-empty string.')
  }
  
  try {
    const fileId = generateFileId()
    const extension = getExtensionFromMime(mimeType)
    const filename = options.filename 
      ? `${options.filename}${extension}` 
      : `${fileId}${extension}`
    const path = getFilePath(options.directory, filename)
    
    // Calculate file size from base64 data, accounting for padding
    const paddingLength = (data.match(/=+$/)?.[0]?.length ?? 0)
    const size = Math.round((data.length * 3) / 4) - paddingLength
    
    // Store the file
    if (isNativePlatform()) {
      // Ensure subdirectory exists
      if (options.directory) {
        try {
          await Filesystem.mkdir({
            path: `${STORAGE_ROOT}/${options.directory}`,
            directory: Directory.Data,
            recursive: true
          })
        } catch {
          // Directory may already exist
        }
      }
      
      await Filesystem.writeFile({
        path,
        data,
        directory: Directory.Data
      })
    } else {
      const storage = await getWebStorage()
      await storage.setItem(path, data)
    }
    
    // Create and store metadata
    const metadata: FileMetadata = {
      id: fileId,
      filename,
      path,
      mimeType,
      mediaType: getMediaTypeFromMime(mimeType),
      size,
      createdAt: new Date().toISOString(),
      metadata: options.metadata
    }
    
    metadataCache.set(fileId, metadata)
    await saveMetadata()
    
    return {
      success: true,
      file: metadata
    }
  } catch (error) {
    console.error('Failed to store file:', error)
    return createError(
      StorageErrorCode.IO_ERROR,
      `Failed to store file: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Retrieve a file from storage
 * 
 * @param fileId - The unique ID of the file
 * @param createObjectUrl - Whether to create an object URL for web access (default: false)
 * @returns RetrieveResult on success, StorageError on failure
 * 
 * @example
 * ```typescript
 * const result = await retrieveFile('abc123', true)
 * if (result.success) {
 *   // Use the object URL in an img tag
 *   imageElement.src = result.objectUrl
 * }
 * ```
 */
export async function retrieveFile(
  fileId: string,
  createObjectUrl: boolean = false
): Promise<RetrieveResult | StorageError> {
  if (!isInitialized) {
    return createError(StorageErrorCode.NOT_INITIALIZED, 'Storage not initialized. Call initializeStorage() first.')
  }
  
  if (!fileId || typeof fileId !== 'string') {
    return createError(StorageErrorCode.INVALID_INPUT, 'Invalid fileId: must be a non-empty string.')
  }
  
  const metadata = metadataCache.get(fileId)
  if (!metadata) {
    return createError(StorageErrorCode.NOT_FOUND, `File not found: ${fileId}`)
  }
  
  try {
    let data: string
    
    if (isNativePlatform()) {
      const result = await Filesystem.readFile({
        path: metadata.path,
        directory: Directory.Data
      })
      data = typeof result.data === 'string' ? result.data : await blobToBase64(result.data)
    } else {
      const storage = await getWebStorage()
      const stored = await storage.getItem<string>(metadata.path)
      if (!stored) {
        return createError(StorageErrorCode.NOT_FOUND, `File data not found: ${fileId}`)
      }
      data = stored
    }
    
    const result: RetrieveResult = {
      success: true,
      file: metadata,
      data
    }
    
    // Create object URL if requested (for use in web/img elements)
    if (createObjectUrl) {
      const binaryData = base64ToArrayBuffer(data)
      const blob = new Blob([binaryData], { type: metadata.mimeType })
      result.objectUrl = URL.createObjectURL(blob)
    }
    
    return result
  } catch (error) {
    console.error('Failed to retrieve file:', error)
    return createError(
      StorageErrorCode.IO_ERROR,
      `Failed to retrieve file: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Delete a file from storage
 * 
 * @param fileId - The unique ID of the file to delete
 * @returns DeleteResult on success, StorageError on failure
 * 
 * @example
 * ```typescript
 * const result = await deleteFile('abc123')
 * if (result.success) {
 *   console.log('Deleted file:', result.id)
 * }
 * ```
 */
export async function deleteFile(fileId: string): Promise<DeleteResult | StorageError> {
  if (!isInitialized) {
    return createError(StorageErrorCode.NOT_INITIALIZED, 'Storage not initialized. Call initializeStorage() first.')
  }
  
  if (!fileId || typeof fileId !== 'string') {
    return createError(StorageErrorCode.INVALID_INPUT, 'Invalid fileId: must be a non-empty string.')
  }
  
  const metadata = metadataCache.get(fileId)
  if (!metadata) {
    return createError(StorageErrorCode.NOT_FOUND, `File not found: ${fileId}`)
  }
  
  try {
    // Delete the file
    if (isNativePlatform()) {
      await Filesystem.deleteFile({
        path: metadata.path,
        directory: Directory.Data
      })
    } else {
      const storage = await getWebStorage()
      await storage.removeItem(metadata.path)
    }
    
    // Remove metadata
    metadataCache.delete(fileId)
    await saveMetadata()
    
    return {
      success: true,
      id: fileId
    }
  } catch (error) {
    console.error('Failed to delete file:', error)
    return createError(
      StorageErrorCode.IO_ERROR,
      `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * List all files in storage, optionally filtered by criteria
 * 
 * @param options - Filter options
 * @returns ListResult on success, StorageError on failure
 * 
 * @example
 * ```typescript
 * // List all images in the receipts directory
 * const result = await listFiles({
 *   directory: 'receipts',
 *   mediaType: MediaType.IMAGE
 * })
 * ```
 */
export async function listFiles(options?: {
  /** Filter by directory */
  directory?: string
  /** Filter by media type */
  mediaType?: MediaType
  /** Filter by metadata field */
  metadataFilter?: (metadata: Record<string, unknown> | undefined) => boolean
}): Promise<ListResult | StorageError> {
  if (!isInitialized) {
    return createError(StorageErrorCode.NOT_INITIALIZED, 'Storage not initialized. Call initializeStorage() first.')
  }
  
  try {
    let files = Array.from(metadataCache.values())
    
    // Apply filters
    if (options?.directory) {
      const dirPath = `${STORAGE_ROOT}/${options.directory}/`
      files = files.filter(f => f.path.startsWith(dirPath))
    }
    
    if (options?.mediaType) {
      files = files.filter(f => f.mediaType === options.mediaType)
    }
    
    if (options?.metadataFilter) {
      const filterFn = options.metadataFilter
      files = files.filter(f => filterFn(f.metadata))
    }
    
    // Sort by creation date, newest first
    files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return {
      success: true,
      files
    }
  } catch (error) {
    console.error('Failed to list files:', error)
    return createError(
      StorageErrorCode.IO_ERROR,
      `Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Get file metadata without loading the file data
 * 
 * @param fileId - The unique ID of the file
 * @returns FileMetadata if found, null otherwise
 */
export function getFileMetadata(fileId: string): FileMetadata | null {
  if (!isInitialized) {
    return null
  }
  return metadataCache.get(fileId) || null
}

/**
 * Get a URL that can be used to access the file
 * On native platforms, this returns a native file URL
 * On web, this creates a temporary object URL that must be revoked when done
 * 
 * @param fileId - The unique ID of the file
 * @returns Object URL or native file path, or null if not found
 */
export async function getFileUrl(fileId: string): Promise<string | null> {
  if (!isInitialized) {
    return null
  }
  
  const metadata = metadataCache.get(fileId)
  if (!metadata) {
    return null
  }
  
  try {
    if (isNativePlatform()) {
      // Return the native file URI
      const result = await Filesystem.getUri({
        path: metadata.path,
        directory: Directory.Data
      })
      return result.uri
    } else {
      // Create and return an object URL
      const retrieveResult = await retrieveFile(fileId, true)
      if (retrieveResult.success && 'objectUrl' in retrieveResult) {
        return retrieveResult.objectUrl || null
      }
      return null
    }
  } catch (error) {
    console.error('Failed to get file URL:', error)
    return null
  }
}

/**
 * Revoke a previously created object URL (web only)
 * Call this when you're done using the URL to free memory
 * 
 * @param url - The object URL to revoke
 */
export function revokeFileUrl(url: string): void {
  if (!isNativePlatform() && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Get total storage size used by all files
 * 
 * @returns Total size in bytes
 */
export function getTotalStorageSize(): number {
  if (!isInitialized) {
    return 0
  }
  
  let total = 0
  for (const metadata of metadataCache.values()) {
    total += metadata.size
  }
  return total
}

/**
 * Clear all files from storage
 * WARNING: This will permanently delete all stored files
 */
export async function clearStorage(): Promise<void> {
  if (!isInitialized) {
    return
  }
  
  try {
    if (isNativePlatform()) {
      // Delete the entire storage directory
      try {
        await Filesystem.rmdir({
          path: STORAGE_ROOT,
          directory: Directory.Data,
          recursive: true
        })
      } catch {
        // Directory may not exist
      }
      
      // Recreate the directory
      await Filesystem.mkdir({
        path: STORAGE_ROOT,
        directory: Directory.Data,
        recursive: true
      })
    } else {
      const storage = await getWebStorage()
      await storage.clear()
    }
    
    metadataCache = new Map()
    await saveMetadata()
  } catch (error) {
    console.error('Failed to clear storage:', error)
    throw error
  }
}

// Helper functions

/**
 * Convert Blob to base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove the data URL prefix if present
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Convert base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

// Re-export types
export * from './types'
