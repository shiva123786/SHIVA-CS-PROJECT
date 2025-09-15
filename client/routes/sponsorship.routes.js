import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createSponsorshipInquiry,
  updateSponsorshipStatus,
  getAllSponsorshipInquiries,
  getSponsorshipInquiryById
} from '../controllers/sponsorship.controller';

const router = express.Router();

// Public route
router.post('/', createSponsorshipInquiry);

// Protected routes (admin only)
router.use(authenticate, authorize(['admin']));
router.get('/', getAllSponsorshipInquiries);
router.get('/:id', getSponsorshipInquiryById);
router.put('/:id/status', updateSponsorshipStatus);

export default router;