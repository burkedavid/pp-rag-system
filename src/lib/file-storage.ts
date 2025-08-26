// Vercel-compatible file storage using memory for temporary uploads
export interface StoredFile {
  id: string;
  originalName: string;
  content: Buffer;
  size: number;
  type: string;
  uploadTime: Date;
}

// Store uploaded files in memory for Vercel serverless compatibility
export const uploadedFilesStore = new Map<string, StoredFile>();

// Clean up old files (older than 1 hour)
export const cleanupOldFiles = () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  for (const [key, file] of uploadedFilesStore) {
    if (file.uploadTime < oneHourAgo) {
      uploadedFilesStore.delete(key);
    }
  }
};