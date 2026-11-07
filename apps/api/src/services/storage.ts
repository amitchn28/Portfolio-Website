import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface IStorageService {
  saveFile(file: Express.Multer.File, subFolder?: string): Promise<UploadResult>;
  deleteFile(fileUrl: string): Promise<boolean>;
}

// Map of allowed MIME types to their legitimate extensions
const MIME_EXTENSION_MAP: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  'application/pdf': ['.pdf'],
};

export class LocalStorageService implements IStorageService {
  private baseDir: string;

  constructor(baseDir: string = env.UPLOAD_DIR) {
    this.baseDir = path.resolve(baseDir);
    this.ensureDirectory(this.baseDir);
  }

  private ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Sanitizes subfolder to prevent path traversal
   */
  private sanitizeFolder(folder: string): string {
    const clean = folder.replace(/[^a-zA-Z0-9_-]/g, '').trim();
    return clean || 'general';
  }

  async saveFile(file: Express.Multer.File, rawFolder: string = 'general'): Promise<UploadResult> {
    const subFolder = this.sanitizeFolder(rawFolder);
    const targetFolder = path.join(this.baseDir, subFolder);
    
    // Strict path traversal boundary assertion
    if (!path.resolve(targetFolder).startsWith(this.baseDir)) {
      throw new Error('Access denied: Invalid upload target directory');
    }

    this.ensureDirectory(targetFolder);

    const originalExt = path.extname(file.originalname).toLowerCase();
    const validExtensions = MIME_EXTENSION_MAP[file.mimetype] || ['.bin'];

    // Verify extension matches declared MIME type
    const safeExt = validExtensions.includes(originalExt) ? originalExt : validExtensions[0];
    const uniqueName = `${uuidv4()}${safeExt}`;
    const destinationPath = path.join(targetFolder, uniqueName);

    // Final boundary check
    if (!path.resolve(destinationPath).startsWith(this.baseDir)) {
      throw new Error('Access denied: Invalid upload file path');
    }

    await fs.promises.writeFile(destinationPath, file.buffer);

    const url = `/uploads/${subFolder}/${uniqueName}`;
    return {
      url,
      filename: uniqueName,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const cleanRelative = fileUrl.replace(/^\/uploads\//, '').replace(/\.\./g, '');
      const fullPath = path.resolve(this.baseDir, cleanRelative);

      // Prevent directory traversal when deleting files
      if (!fullPath.startsWith(this.baseDir)) {
        console.warn('⚠️ Path traversal attempt in deleteFile:', fileUrl);
        return false;
      }

      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to delete file from disk:', err);
      return false;
    }
  }
}

export const storageService = new LocalStorageService();

// Multer memory storage configuration (buffers in memory, passes to storageService)
const memoryStorage = multer.memoryStorage();

export const fileUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (Object.keys(MIME_EXTENSION_MAP).includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Only JPEG, PNG, WEBP, SVG, and PDF are allowed.'));
    }
  },
});
