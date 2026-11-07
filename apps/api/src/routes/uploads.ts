import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { fileUpload, storageService } from '../services/storage';
import { ApiResponse } from '@amit/shared';

const router = Router();

// Generic upload handler
const handleUpload = async (req: AuthenticatedRequest, res: Response<ApiResponse>, defaultFolder: string = 'general') => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded. Please include a file under field "file".',
        error: { code: 'FILE_MISSING' },
      });
      return;
    }

    const folder = (req.body.folder as string) || defaultFolder;
    const result = await storageService.saveFile(req.file, folder);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: { code: 'UPLOAD_ERROR', details: (err as Error).message },
    });
  }
};

// POST /api/uploads (General)
router.post('/', requireAuth, fileUpload.single('file'), (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  return handleUpload(req, res, 'general');
});

// POST /api/uploads/profile (Profile Pictures)
router.post('/profile', requireAuth, fileUpload.single('file'), (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  return handleUpload(req, res, 'profile');
});

// POST /api/uploads/project (Project Thumbnails & Screenshots)
router.post('/project', requireAuth, fileUpload.single('file'), (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  return handleUpload(req, res, 'projects');
});

// POST /api/uploads/resume (Resume PDF documents)
router.post('/resume', requireAuth, fileUpload.single('file'), (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  return handleUpload(req, res, 'resume');
});

// DELETE /api/uploads (Delete file from disk)
router.delete('/', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      res.status(400).json({ success: false, message: 'fileUrl is required' });
      return;
    }

    const deleted = await storageService.deleteFile(fileUrl);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'File not found on storage disk' });
      return;
    }

    res.status(200).json({ success: true, message: 'File deleted from disk' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete file', error: { code: 'DELETE_ERROR' } });
  }
});

export const uploadRoutes = router;
