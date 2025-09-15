import express from 'express';
import multer from 'multer';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  uploadMedia,
  updateMedia,
  deleteMedia,
  getMediaById,
  getFeaturedMedia
} from '../controllers/media.controller';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedMedia);
router.get('/:id', getMediaById);

// Protected routes
router.use(authenticate, authorize(['admin', 'department_admin']));
router.post('/', upload.single('file'), uploadMedia);
router.put('/:id', upload.single('file'), updateMedia);
router.delete('/:id', deleteMedia);

export default router;