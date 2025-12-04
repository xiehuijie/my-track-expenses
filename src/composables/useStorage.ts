/**
 * Composable for file storage operations in Vue components
 * 
 * Provides reactive state and convenient methods for storing and managing
 * media files (images, videos, audio) associated with transactions.
 */

import { ref, computed, onUnmounted } from 'vue'
import {
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
  type FileMetadata,
  type StorageOptions,
  type StoreResult,
  type StorageError,
  MediaType
} from '../storage/StorageService'

/**
 * Composable for managing file storage in Vue components
 * 
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useStorage } from '@/composables/useStorage'
 * 
 * const { 
 *   isReady, 
 *   isLoading, 
 *   error, 
 *   saveFile, 
 *   loadFile,
 *   getUrl
 * } = useStorage()
 * 
 * async function handleFileUpload(file: File) {
 *   const result = await saveFile(file, { 
 *     directory: 'receipts',
 *     metadata: { transactionId: '123' }
 *   })
 *   if (result) {
 *     console.log('Saved file:', result.id)
 *   }
 * }
 * </script>
 * ```
 */
export function useStorage() {
  const isReady = ref(isStorageInitialized())
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Track created object URLs for cleanup
  const objectUrls = ref<string[]>([])
  
  /**
   * Initialize storage if not already initialized
   */
  async function initialize(): Promise<boolean> {
    if (isReady.value) {
      return true
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      await initializeStorage()
      isReady.value = true
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to initialize storage'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Convert a File object to base64 string
   */
  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remove the data URL prefix
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
  
  /**
   * Save a File object to storage
   * 
   * @param file - File object to save
   * @param options - Storage options
   * @returns FileMetadata if successful, null otherwise
   */
  async function saveFile(
    file: File,
    options?: StorageOptions
  ): Promise<FileMetadata | null> {
    if (!isReady.value) {
      const initialized = await initialize()
      if (!initialized) {
        return null
      }
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const base64 = await fileToBase64(file)
      const result = await storeFile(base64, file.type, {
        ...options,
        filename: options?.filename || file.name.replace(/\.[^.]+$/, '')
      })
      
      if (result.success) {
        return result.file
      } else {
        error.value = (result as StorageError).error
        return null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to save file'
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Save base64 data directly to storage
   * 
   * @param base64Data - Base64 encoded file data (without data URL prefix)
   * @param mimeType - MIME type of the file
   * @param options - Storage options
   * @returns FileMetadata if successful, null otherwise
   */
  async function saveBase64(
    base64Data: string,
    mimeType: string,
    options?: StorageOptions
  ): Promise<FileMetadata | null> {
    if (!isReady.value) {
      const initialized = await initialize()
      if (!initialized) {
        return null
      }
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const result = await storeFile(base64Data, mimeType, options)
      
      if (result.success) {
        return (result as StoreResult).file
      } else {
        error.value = (result as StorageError).error
        return null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to save file'
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Load a file by ID
   * 
   * @param fileId - Unique file ID
   * @param withObjectUrl - Whether to create an object URL
   * @returns Object with file metadata and data, or null if not found
   */
  async function loadFile(
    fileId: string,
    withObjectUrl: boolean = false
  ): Promise<{ metadata: FileMetadata; data: string; objectUrl?: string } | null> {
    if (!isReady.value) {
      const initialized = await initialize()
      if (!initialized) {
        return null
      }
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const result = await retrieveFile(fileId, withObjectUrl)
      
      if (result.success) {
        // Track object URL for cleanup
        if (result.objectUrl) {
          objectUrls.value.push(result.objectUrl)
        }
        
        return {
          metadata: result.file,
          data: result.data,
          objectUrl: result.objectUrl
        }
      } else {
        error.value = (result as StorageError).error
        return null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load file'
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Get a URL for a file (for use in img/video/audio elements)
   * The URL is automatically tracked for cleanup when the component unmounts
   * 
   * @param fileId - Unique file ID
   * @returns URL string or null if not found
   */
  async function getUrl(fileId: string): Promise<string | null> {
    if (!isReady.value) {
      const initialized = await initialize()
      if (!initialized) {
        return null
      }
    }
    
    try {
      const url = await getFileUrl(fileId)
      if (url && url.startsWith('blob:')) {
        objectUrls.value.push(url)
      }
      return url
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to get file URL'
      return null
    }
  }
  
  /**
   * Delete a file by ID
   * 
   * @param fileId - Unique file ID
   * @returns true if successful, false otherwise
   */
  async function removeFile(fileId: string): Promise<boolean> {
    if (!isReady.value) {
      const initialized = await initialize()
      if (!initialized) {
        return false
      }
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const result = await deleteFile(fileId)
      
      if (result.success) {
        return true
      } else {
        error.value = (result as StorageError).error
        return false
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete file'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * List all files, optionally filtered
   * 
   * @param options - Filter options
   * @returns Array of FileMetadata
   */
  async function getFiles(options?: {
    directory?: string
    mediaType?: MediaType
  }): Promise<FileMetadata[]> {
    if (!isReady.value) {
      const initialized = await initialize()
      if (!initialized) {
        return []
      }
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const result = await listFiles(options)
      
      if (result.success) {
        return result.files
      } else {
        error.value = (result as StorageError).error
        return []
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to list files'
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Get file metadata without loading data
   * 
   * @param fileId - Unique file ID
   * @returns FileMetadata or null
   */
  function getMetadata(fileId: string): FileMetadata | null {
    return getFileMetadata(fileId)
  }
  
  /**
   * Get total storage size
   */
  const totalSize = computed(() => getTotalStorageSize())
  
  /**
   * Format file size for display
   */
  function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  /**
   * Clean up object URLs when component unmounts
   */
  function cleanup(): void {
    for (const url of objectUrls.value) {
      revokeFileUrl(url)
    }
    objectUrls.value = []
  }
  
  // Automatically cleanup on component unmount
  onUnmounted(cleanup)
  
  return {
    // State
    isReady,
    isLoading,
    error,
    totalSize,
    
    // Methods
    initialize,
    saveFile,
    saveBase64,
    loadFile,
    getUrl,
    removeFile,
    getFiles,
    getMetadata,
    formatSize,
    cleanup,
    
    // Re-export types and enums for convenience
    MediaType
  }
}
