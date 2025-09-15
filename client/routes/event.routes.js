import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById
} from '../controllers/event.controller';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes (admin only)
router.use(authenticate, authorize(['admin', 'department_admin']));
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;