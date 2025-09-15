import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  getAllDepartments,
  getDepartmentById,
  getDepartmentMedia,
  getDepartmentEvents
} from '../controllers/department.controller';

const router = express.Router();

router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);
router.get('/:id/media', getDepartmentMedia);
router.get('/:id/events', getDepartmentEvents);

export default router;