import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createContactMessage,
  updateContactMessageStatus,
  getAllContactMessages,
  getContactMessageById
} from '../controllers/contact.controller';

const router = express.Router();

// Public route
router.post('/', createContactMessage);

// Protected routes (admin only)
router.use(authenticate, authorize(['admin']));
router.get('/', getAllContactMessages);
router.get('/:id', getContactMessageById);
router.put('/:id/status', updateContactMessageStatus);

export default router;