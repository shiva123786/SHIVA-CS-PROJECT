import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createRegistration,
  updateRegistrationStatus,
  getAllRegistrations,
  getRegistrationById
} from '../controllers/registration.controller';

const router = express.Router();

// Public route
router.post('/', createRegistration);

// Protected routes (admin only)
router.use(authenticate, authorize(['admin']));
router.get('/', getAllRegistrations);
router.get('/:id', getRegistrationById);
router.put('/:id/status', updateRegistrationStatus);

export default router;